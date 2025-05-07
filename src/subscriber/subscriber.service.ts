import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { v4 as uuidv4 } from 'uuid';
import { Subscriber } from './entities/subscriber.entity';
import { ServicesService } from 'src/services/services.service';
import { ErrorMessages } from 'src/utils/messages';

@Injectable()
export class SubscriberService {
  constructor(private readonly helperService: ServicesService) {}

  async create(createSubscriberDto: CreateSubscriberDto) {
    try {
      if (!createSubscriberDto.SAccountId) {
        throw new BadRequestException(ErrorMessages.SACCOUNT_REQUIRED);
      } else {
        const subscriber = await Subscriber.find({
          where: { SAccountId: createSubscriberDto.SAccountId },
        });
        const provider = await Subscriber.find({
          where: { SAccountId: createSubscriberDto.SProviderId },
        });
        if (subscriber.length > 0) {
          throw new BadRequestException(ErrorMessages.ACCOUNTID_ALREADY_EXISTS);
        } else {
          if (!createSubscriberDto.SProviderId || !provider) {
            const SAuthCode = await uuidv4();
            const newSubscriber = new Subscriber();
            Object.assign(newSubscriber, createSubscriberDto);
            newSubscriber.SAuthCode = SAuthCode;
            newSubscriber.SEmailVerified = false;
            newSubscriber.SProviderId = '0';
            await newSubscriber.save();
            return newSubscriber;
          } else {
            const SAuthCode = await uuidv4();
            const newSubscriber = new Subscriber();
            Object.assign(newSubscriber, createSubscriberDto);
            newSubscriber.SAuthCode = SAuthCode;
            newSubscriber.SEmailVerified = false;
            await newSubscriber.save();
            return newSubscriber;
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }
  async update(authToken: string, updateSubscriberDto: UpdateSubscriberDto) {
    try {
      const subscriber = await this.helperService.accountValidation(authToken);
      if (!subscriber) {
        throw new NotFoundException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      }
      const { SFromEmailId } = updateSubscriberDto;
      if (updateSubscriberDto.SAccountId || updateSubscriberDto.SProviderId) {
        throw new BadRequestException(
          ErrorMessages.SPROVIDERID_SACCOUNTID_CANNOT_BE_EDITED,
        );
      }
      if (SFromEmailId) {
        Object.assign(subscriber, updateSubscriberDto);
        await subscriber.save();
        return subscriber;
      } else {
        throw new BadRequestException(ErrorMessages.SFROMEMAILID_REQUIRED);
      }
    } catch (e) {
      throw e;
    }
  }

  async updateEmailVerified(authToken: string) {
    try {
      const subscriber = await this.helperService.accountValidation(authToken);
      if (!subscriber) {
        throw new NotFoundException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      }
      subscriber.SEmailVerified = true;
      await subscriber.save();
      return subscriber;
    } catch (e) {
      throw e;
    }
  }

  async findAll() {
    try {
      const subscribers = await Subscriber.find();
      if (subscribers.length > 0) {
        return subscribers;
      } else {
        throw new NotFoundException('No Subscribers found');
      }
    } catch (e) {
      throw e;
    }
  }
}
