import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ServicesService } from 'src/services/services.service';
import { ConfigModule } from '@nestjs/config';
import { BlacklistEmailModule } from 'src/black-list-emails/black-list-emails.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    BlacklistEmailModule,
  ],
  controllers: [EmailController],
  providers: [EmailService, ServicesService],
})
export class EmailModule {}
