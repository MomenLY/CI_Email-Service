import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBulkEmailDto } from './dto/create-bulk-email.dto';
import { UpdateBulkEmailDto } from './dto/update-bulk-email.dto';
import * as nodemailer from 'nodemailer';
import * as aws from 'aws-sdk';
import { ServicesService } from 'src/services/services.service';
import { ErrorMessages } from 'src/utils/messages';
import { EmailService } from 'src/email/email.service';
import { BlacklistEmailService } from 'src/black-list-emails/black-list-emails.service';
import { Subject } from 'rxjs';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Injectable()
export class BulkEmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly emailsPerSecond: number = 14;
  constructor(private helperService: ServicesService, private blackListService: BlacklistEmailService, private emailService: EmailService) {
    // Initialize SES transporter
    const ses = new aws.SES({
      // apiVersion: '2010-12-01',
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESSKEY_ID,
      secretAccessKey: process.env.AWS_SECRETACCESS_KEY,
    });

    this.transporter = nodemailer.createTransport({
      SES: { ses, aws }
    });
  }

  async sendBulkEmails(emailData: any, authToken: string) {
    try {
      const subscriber = await this.helperService.accountValidation(authToken);
      console.log(subscriber, "1")
      if (!subscriber) {
        throw new BadRequestException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      } else {
        let replacedTemplate;
        let templateLayer;
        let fullTemplate;
        const res = await this.emailService.checkIsBlackList(emailData.to);
        emailData.to = res.non_blackListedEmails;
        if (emailData.to.length === 0) {
          throw new BadRequestException({ message: 'All Emails are blacklisted', blackListedEmails: res.blackListedEmails });
        } else {
          const recipientBatches = await this.emailService.createBatches(emailData.to, this.emailsPerSecond);
          const template = await this.emailService.fetchTemplate(emailData.templateCode, subscriber.SAccountId, subscriber.SProviderId);
          if (!template || template === 'No template found') {
            throw new BadRequestException(ErrorMessages.TEMPLATE_NOT_FOUND);
          } else {
            templateLayer = await this.emailService.fetchTemplateLayer(subscriber.SAccountId, subscriber.SProviderId);
            if (!templateLayer || templateLayer === 'No template layer found') {
              throw new BadRequestException(ErrorMessages.TEMPLATE_NOT_FOUND);
            } else {
              fullTemplate = templateLayer.TLTemplateLayer.replace(
                '{{body}}',
                replacedTemplate,
              );
              if (!fullTemplate || fullTemplate === undefined || fullTemplate === null) {
                throw new BadRequestException(ErrorMessages.TEMPLATE_NOT_FOUND);
              } else {
                const status = {
                  totalEmails: emailData.to.length,
                  sentEmails: 0,
                  failedEmails: 0,
                  blacklistedEmails: []
                };

                for (let i = 0; i < recipientBatches.length; i++) {
                  const batch = recipientBatches[i];
                  const promises = batch.map(recipient => {
                    const magicQuotes = {
                      ...emailData.data,
                      userName: recipient.name
                    };

                    const replacedTemplate = this.emailService.replacePlaceholders(template.TBody, magicQuotes);

                    if (replacedTemplate) {
                      return this.sendSingleEmail(
                        subscriber.SFromEmailId,
                        recipient.email,
                        replacedTemplate,
                        emailData.data.subject
                      );
                    } else {
                      throw new BadRequestException("Error in replacing magic quotes")
                    }
                  });

                  const results = await Promise.allSettled(promises);

                  results.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                      status.sentEmails++;
                    } else {
                      status.failedEmails++;
                      this.handleSendFailure(batch[index].email, result.reason);
                    }
                  });
                }
              }
            }
          }
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async sendSingleEmail(from: string, to: string, data: any, subject: string) {
    try {
      const isBlacklisted = await this.blackListService.isEmailBlacklisted(to);
      if (isBlacklisted) {
        throw new Error('Email is blacklisted');
      }

      const mailOptions = {
        from,
        to,
        subject: subject,
        html: data
      }

      const response = await this.transporter.sendMail(mailOptions);
    } catch (e) {
      console.log(e)
    }
  }

  private async handleSendFailure(email: string, error: any) {
    const isPermanentFailure = this.isPermanentFailure(error);
    if (isPermanentFailure) {
      await this.blackListService.addEmailToBlacklist(email);
    }
  }

  private isPermanentFailure(error: any): boolean {
    if (error?.code === 'MessageRejected' ||
      error?.code === 'InvalidParameter' ||
      error?.message?.includes('Address blacklisted')) {
      return true;
    }
    return false;
  }
}
