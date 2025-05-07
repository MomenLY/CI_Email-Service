import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTemplateLayerDto } from './dto/create-template-layer.dto';
import { UpdateTemplateLayerDto } from './dto/update-template-layer.dto';
import { ServicesService } from 'src/services/services.service';
import { TemplateLayer } from './entities/template-layer.entity';
import { ErrorMessages } from 'src/utils/messages';

@Injectable()
export class TemplateLayerService {
  constructor(private helperService: ServicesService) {}

  checkTemplateLayerExists = async (subscriberId: string) => {
    const templateLayers = await TemplateLayer.findOne({
      where: { TLAccountId: subscriberId },
    });
    return templateLayers;
  };

  async create(
    createTemplateLayerDto: CreateTemplateLayerDto,
    authToken: string,
  ) {
    try {
      const subscriber = await this.helperService.accountValidation(authToken);
      if (!subscriber) {
        throw new BadRequestException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      } else {
        const subscriberId = subscriber.SAccountId;
        const providerId = subscriber.SProviderId;
        const { TLTemplateLayer } = createTemplateLayerDto;
        if (!TLTemplateLayer) {
          throw new BadRequestException(ErrorMessages.TLTEMPLATE_LAYER_MISSING);
        }
        if (!TLTemplateLayer.includes('{{body}}')) {
          throw new BadRequestException(
            ErrorMessages.TLTEMPLATE_LAYER_BODY_MISSING,
          );
        }
        if (providerId === '0') {
          const existingTemplateLayer = await TemplateLayer.findOne({
            where: {
              TLTemplateLayer: TLTemplateLayer,
              TLProviderId: providerId,
            },
          });

          if (existingTemplateLayer) {
            throw new BadRequestException(
              ErrorMessages.TLTEMPLATE_LAYER_ALREADY_EXISTS,
            );
          } else {
            const newTemplateLayer = new TemplateLayer();
            newTemplateLayer.TLTemplateLayer = TLTemplateLayer;
            newTemplateLayer.TLAccountId = subscriberId;
            newTemplateLayer.TLProviderId = providerId;
            await newTemplateLayer.save();
            return newTemplateLayer;
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
    updateTemplateLayerDto: UpdateTemplateLayerDto,
    authToken: string,
  ) {
    try {
      const subscriber = await this.helperService.accountValidation(authToken);
      if (!subscriber) {
        throw new BadRequestException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      } else {
        const providerId = subscriber.SProviderId;
        const subscriberId = subscriber.SAccountId;
        const { TLTemplateLayer } = updateTemplateLayerDto;
        if (!TLTemplateLayer) {
          throw new BadRequestException(ErrorMessages.TLTEMPLATE_LAYER_MISSING);
        }
        if (!TLTemplateLayer.includes('{{body}}')) {
          throw new BadRequestException(
            ErrorMessages.TLTEMPLATE_LAYER_BODY_MISSING,
          );
        }

        const templateLayerToBeUpdated = await TemplateLayer.findOne({
          where: { TLAccountId: subscriberId },
        });

        if (templateLayerToBeUpdated) {
          if (templateLayerToBeUpdated.TLTemplateLayer === TLTemplateLayer) {
            throw new BadRequestException(
              ErrorMessages.TLTEMPLATE_LAYER_ALREADY_EXISTS,
            );
          } else {
            templateLayerToBeUpdated.TLTemplateLayer = TLTemplateLayer;
            const res = await templateLayerToBeUpdated.save();
            return res;
          }
        } else {
          const templateLayer = await TemplateLayer.findOne({
            where: { TLProviderId: '0' },
          });
          if (templateLayer) {
            const newTemplateLayer = new TemplateLayer();
            newTemplateLayer.TLTemplateLayer = TLTemplateLayer;
            newTemplateLayer.TLAccountId = subscriberId;
            newTemplateLayer.TLProviderId = providerId;
            const res = await newTemplateLayer.save();
            return res;
          } else {
            throw new NotFoundException(
              ErrorMessages.TEMPLATELAYER_ALREADY_EXISTS,
            );
          }
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async findAll(authCode: string) {
    try {
      console.log(authCode);
      const subscriber = await this.helperService.accountValidation(authCode);
      if (subscriber) {
        const emailTemplateLayers = await TemplateLayer.find({
          where: { TLAccountId: subscriber.SAccountId },
        });
        return emailTemplateLayers;
      } else {
        throw new BadRequestException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      }
    } catch (e) {
      throw e;
    }
  }
}
