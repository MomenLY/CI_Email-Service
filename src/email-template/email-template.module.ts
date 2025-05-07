import { Module } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateController } from './email-template.controller';
import { ServicesService } from 'src/services/services.service';

@Module({
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService, ServicesService],
  exports: [ServicesService],
})
export class EmailTemplateModule {}
