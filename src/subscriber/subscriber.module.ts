import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { ServicesService } from 'src/services/services.service';

@Module({
  controllers: [SubscriberController],
  providers: [SubscriberService, ServicesService],
})
export class SubscriberModule {}
