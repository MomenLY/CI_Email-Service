import { Module } from '@nestjs/common';
import { BulkEmailService } from './bulk-email.service';
import { BulkEmailController } from './bulk-email.controller';
import { BlacklistEmailModule } from 'src/black-list-emails/black-list-emails.module';
import { ConfigModule } from '@nestjs/config';
import { ServicesService } from 'src/services/services.service';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    BlacklistEmailModule,
  ],
  controllers: [BulkEmailController],
  providers: [BulkEmailService, ServicesService, EmailService],
})
export class BulkEmailModule { }
