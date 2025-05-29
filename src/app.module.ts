import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { determineDatabaseModule } from './utils/helper';
import { EmailTemplateModule } from './email-template/email-template.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { TransformInterceptor } from './interceptors/transform.interceptor'; // Import the interceptor
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServicesService } from './services/services.service';
import { TemplateLayerModule } from './template-layer/template-layer.module';
import { EmailModule } from './email/email.module';
import { BlacklistEmailModule } from './black-list-emails/black-list-emails.module';
import { BulkEmailModule } from './bulk-email/bulk-email.module';

@Module({
  imports: [
    determineDatabaseModule(),
    EmailTemplateModule,
    SubscriberModule,
    TemplateLayerModule,
    EmailModule,
    BlacklistEmailModule,
    BulkEmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    ServicesService,
  ], // Provide the interceptor using the correct syntax
})
export class AppModule {}
