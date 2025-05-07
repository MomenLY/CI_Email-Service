import { Controller, Post, Body, Put, Headers, Get } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ServicesService } from '../services/services.service';

@Controller('subscriber')
export class SubscriberController {
  constructor(
    private readonly subscriberService: SubscriberService,
    private readonly helperService: ServicesService,
  ) {}

  @Post()
  create(@Body() createSubscriberDto: CreateSubscriberDto) {
    return this.subscriberService.create(createSubscriberDto);
  }

  @Put()
  update(
    @Headers('Auth-Code') authToken: string,
    @Body() updateSubscriberDto: UpdateSubscriberDto,
  ) {
    return this.subscriberService.update(authToken, updateSubscriberDto);
  }

  @Post('verifyEmail')
  async sendVerificationEmail(@Headers('Auth-Code') authToken: string) {
    try {
      const result = await this.helperService.sendVerificationEmail(authToken);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('IsEmailVerified')
  async verifyEmail(@Headers('Auth-Code') authToken: string) {
    const verified = await this.helperService.isEmailVerified(authToken);
    if (verified) {
      return this.subscriberService.updateEmailVerified(authToken);
    }
    return { verified: false };
  }

  @Get()
  findAll() {
    return this.subscriberService.findAll();
  }
}
