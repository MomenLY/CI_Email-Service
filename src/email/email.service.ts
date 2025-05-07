import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { SES } from 'aws-sdk';
import { ServicesService } from 'src/services/services.service';
import { Email } from './entities/email.entity';
import { EmailTemplate } from 'src/email-template/entities/email-template.entity';
import { TemplateLayer } from 'src/template-layer/entities/template-layer.entity';
import { Subscriber } from 'src/subscriber/entities/subscriber.entity';
import { ErrorMessages, SuccessMessages } from 'src/utils/messages';
import { BlacklistEmailService } from 'src/black-list-emails/black-list-emails.service';

interface EmailToProcess {
  ESubscriberId: string;
  EStatus: number;
  EBody: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    templateCode?: string;
    data?: object;
    multiThread?: boolean;
  };
}

interface Template {
  TTemplateCode: string;
  TSubject: string;
}

interface Subscribers {
  SFromEmailId: string;
}
@Injectable()
export class EmailService {
  private readonly ses: SES;
  constructor(private readonly helperService: ServicesService, private blackListService: BlacklistEmailService) {
    this.ses = new SES({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESSKEY_ID,
      secretAccessKey: process.env.AWS_SECRETACCESS_KEY,
    });
  }
  async create(createEmailDto: CreateEmailDto, authToken: string) {
    try {
      const subscriber = await this.helperService.accountValidation(authToken);
      if (!subscriber) {
        throw new BadRequestException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      } else {
        //checking for black listed emails
        const res = await this.checkIsBlackList(createEmailDto.to);
        createEmailDto.to = res.non_blackListedEmails

        //if all the emails are blacklisted then throw error
        if(createEmailDto.to.length === 0) {
          throw new BadRequestException({message: 'All Emails are blacklisted', blackListedEmails: res.blackListedEmails});
        }

        const email = new Email();
        email.ESubscriberId = subscriber.SAccountId;
        email.EStatus = 0;
        email.EBody = createEmailDto;
        await email.save();
        const result: any = await this.processEmailQueue();
        return {message: result, blackListedEmails: res.blackListedEmails};
      }
    } catch (error) {
      throw new BadRequestException(ErrorMessages.ERROR_CREATING_EMAIL);
    }
  }

  private async fetchTemplate(templateCode: string, subscriberId: string) {
    const template = await EmailTemplate.findOne({
      where: { TTemplateCode: templateCode, TAccountId: subscriberId },
    });
    return template;
  }
  private async processEmailQueue() {
    const emailsToProcess = await Email.find({ where: { EStatus: 0 } });

    if (emailsToProcess.length > 0) {
      const emailToProcess = emailsToProcess[0];
      emailToProcess.EStatus = 2;
      await emailToProcess.save();

      const template = await this.fetchTemplate(
        emailToProcess.EBody.templateCode,
        emailToProcess.ESubscriberId,
      );
  
      if (!template) {
        throw new BadRequestException(ErrorMessages.TEMPLATE_NOT_FOUND);
      } else {
        const replacedTemplate = this.replacePlaceholders(
          template.TBody,
          emailToProcess.EBody.data,
        );
        const templateLayer = await TemplateLayer.findOne({
          where: { TLAccountId: emailToProcess.ESubscriberId },
        });
        const fullTemplate = templateLayer.TLTemplateLayer.replace(
          '{{body}}',
          replacedTemplate,
        );
        const subscriber = await Subscriber.findOne({
          where: { SAccountId: emailToProcess.ESubscriberId },
        });

        try {
          const emailResult = await this.sendEmail(
            emailToProcess,
            subscriber,
            fullTemplate,
            template,
          );

          if (emailResult) {
            emailToProcess.EStatus = 1;
            await emailToProcess.save();
            await this.processEmailQueue();
            return SuccessMessages.EMAIL_SENT_SUCCESS;
          } else {

            emailToProcess.EStatus = 3;
            await emailToProcess.save();
            await this.processEmailQueue();
            return ErrorMessages.ERROR_CREATING_EMAIL;
          }
        } catch (error) {
          console.log(error, 'email error');
          emailToProcess.EStatus = 3;
          await emailToProcess.save();
          await this.processEmailQueue();
          // throw error
        }
      }
    } else {
      return;
    }
  }

  async checkIsBlackList(emails: string[]){
    const blackListedEmails = []
    const non_blackListedEmails = []
    for (const email of emails) {
      const res = await this.blackListService.isEmailBlacklisted(email);
      if(res === true){
        blackListedEmails.push(email)
      } else {
        non_blackListedEmails.push(email)
      }
    }
    return {blackListedEmails, non_blackListedEmails}
  }

  private async sendEmail(
    emailToProcess: EmailToProcess,
    subscriber: Subscribers,
    fullTemplate: any,
    template: Template,
  ) {
    const toAddresses = emailToProcess.EBody.to;

    for (const toAddress of toAddresses) {
      const params = {
        Destination: {
          ToAddresses:
            emailToProcess.EBody.multiThread === true
              ? [toAddress]
              : emailToProcess.EBody.to,
          CcAddresses: emailToProcess.EBody.cc || [],
          BccAddresses: emailToProcess.EBody.bcc || [],
        },
        Message: {
          Body: {
            Html: {
              Data: fullTemplate,
            },
          },
          Subject: {
            Data: template.TSubject,
          },
        },
        Source: subscriber.SFromEmailId,
      };

      try {
        const res = await this.ses.sendEmail(params).promise();
        return res;
      } catch (error) {
        await this.blackListService.addEmailToBlacklist(toAddress);
        console.error(
          ErrorMessages.ERROR_CREATING_EMAIL + ` to ${toAddress}:`,
          error,
        );
      }
    }
  }

  private replacePlaceholders(template: string, data: any) {
    let replacedTemplate = template;
    for (const key of Object.keys(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      replacedTemplate = replacedTemplate.replace(regex, data[key]);
    }
    return replacedTemplate;
  }

  async findAll(authToken: string) {
    const subscriber = await this.helperService.accountValidation(authToken);
    if (subscriber === null) {
      throw new BadRequestException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
    } else {
      const emailQueue = await Email.find();
      if (emailQueue.length > 0) {
        return emailQueue;
      } else {
        return ErrorMessages.EMAIL_QUEUE_EMPTY;
      }
    }
  }
}
