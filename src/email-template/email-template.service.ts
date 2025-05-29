import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { EmailTemplate } from './entities/email-template.entity';
import { ServicesService } from 'src/services/services.service';
import { ErrorMessages } from 'src/utils/messages';

@Injectable()
export class EmailTemplateService {
  constructor(private readonly helperService: ServicesService) { }

  checkTemplate = async (templateCode: string, subscriberId: string) => {
    const template = await EmailTemplate.findOne({
      where: { TTemplateCode: templateCode, TAccountId: subscriberId },
    });
    return template;
  };

  async create(
    createEmailTemplateDto: CreateEmailTemplateDto,
    authToken: string,
  ) {
    try {
      const subscriber = await this.helperService.accountValidation(authToken);
      if (!subscriber) {
        throw new BadRequestException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      } else {
        const providerId = subscriber.SProviderId;
        const subscriberId = subscriber.SAccountId;
        if (providerId === '0') {
          const { TTemplateCode, TName, TSubject, TBody, TMagicQuotes } =
            createEmailTemplateDto;
          const template = await this.checkTemplate(
            TTemplateCode,
            subscriberId,
          );
          if (!template) {
            const newTemplate = new EmailTemplate();
            newTemplate.TName = TName;
            newTemplate.TSubject = TSubject;
            newTemplate.TBody = TBody;
            newTemplate.TMagicQuotes = TMagicQuotes;
            newTemplate.TTemplateCode = TTemplateCode;
            newTemplate.TAccountId = subscriberId;
            newTemplate.TProviderId = providerId;
            await newTemplate.save();
            return newTemplate;
          } else {
            throw new BadRequestException(
              ErrorMessages.TEMPLATE_ALREADY_EXISTS,
            );
          }
        } else {
          throw new BadRequestException(
            ErrorMessages.UNAUTHORIZED_TEMPLATE_CREATION,
          );
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async update(
    authToken: string,
    templateCode: string,
    updateEmailTemplateDto: UpdateEmailTemplateDto,
  ) {
    try {
      const subscriber = await this.helperService.accountValidation(authToken);
      if (!subscriber) {
        throw new NotFoundException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      } else {
        const subscriberId = subscriber.SAccountId;
        const providerId = subscriber.SProviderId;
        const { TName, TSubject, TBody, TMagicQuotes } = updateEmailTemplateDto;
        const errorMessage = [];

        if (!TName || !TSubject || !TBody || !TMagicQuotes) {
          errorMessage.push(ErrorMessages.MISSING_FIELDS);
        }

        if (errorMessage.length > 0) {
          throw new BadRequestException(errorMessage);
        }
        const templateToBeUpdated = await this.checkTemplate(
          templateCode,
          subscriberId,
        );
        const params = {
          TName: TName,
          TSubject: TSubject,
          TBody: TBody,
          TMagicQuotes: TMagicQuotes,
          TTemplateCode: templateCode,
          TAccountId: subscriberId,
          TProviderId: providerId,
        };

        if (templateToBeUpdated) {
          if (templateToBeUpdated.TBody === TBody) {
            throw new BadRequestException(
              ErrorMessages.TEMPLATE_ALREADY_EXISTS,
            );
          }
          const res = await this.saveTemplate(templateToBeUpdated, params);
          return res;
        } else {
          const newTemplateToBeUpdated = await EmailTemplate.findOne({
            where: { TTemplateCode: templateCode, TAccountId: providerId },
          });
          if (newTemplateToBeUpdated) {
            const newTemplate = new EmailTemplate();
            const res = await this.saveTemplate(newTemplate, params);
            return res;
          } else {
            throw new BadRequestException(ErrorMessages.TEMPLATE_NOT_FOUND);
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async saveTemplate(templateObject: any, params: any) {
    templateObject.TName = params.TName;
    templateObject.TSubject = params.TSubject;
    templateObject.TBody = params.TBody;
    templateObject.TMagicQuotes = params.TMagicQuotes;
    templateObject.TTemplateCode = params.TTemplateCode;
    templateObject.TAccountId = params.TAccountId;
    templateObject.TProviderId = params.TProviderId;
    await templateObject.save();
    return templateObject;
  }

  async findAll(authToken: string) {
    try {
      const subscriber = await this.helperService.accountValidation(authToken);
      if (subscriber) {
        let emailTemplates
        emailTemplates = await EmailTemplate.find({
          where: { TAccountId: subscriber.SAccountId },
        });
        if(emailTemplates.length === 0){
          emailTemplates = await EmailTemplate.find({
            where: {TAccountId: subscriber.SProviderId}
          });
        }
        return emailTemplates;
      } else {
        throw new BadRequestException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      }
    } catch (e) {
      throw e;
    }
  }

  async findOne(authToken: string, tempCode: string) {
    try {
      const subscriber = await this.helperService.accountValidation(authToken);
      if (subscriber) {
        const emailTemplate = await EmailTemplate.findOne({
          where: { TAccountId: subscriber.SAccountId, TTemplateCode: tempCode },
        });
        return emailTemplate;
      } else {
        throw new BadRequestException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      }
    } catch (e) {
      throw e;
    }
  }
}
