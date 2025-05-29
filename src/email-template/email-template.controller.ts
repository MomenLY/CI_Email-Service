import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Headers,
  Query,
} from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { ServicesService } from 'src/services/services.service';

@Controller('template')
export class EmailTemplateController {
  constructor(
    private readonly emailTemplateService: EmailTemplateService,
    private readonly helperService: ServicesService,
  ) { }

  @Post()
  create(
    @Body() createEmailTemplateDto: CreateEmailTemplateDto,
    @Headers('Auth-Code') authToken: string,
  ) {
    return this.emailTemplateService.create(createEmailTemplateDto, authToken);
  }

  @Get()
  findAll(@Headers('Auth-Code') authToken: string) {
    return this.emailTemplateService.findAll(authToken);
  }


  @Put(':templateCode')
  update(
    @Headers('Auth-Code') authToken: string,
    @Param('templateCode') templateCode: string,
    @Body() updateEmailTemplateDto: UpdateEmailTemplateDto,
  ) {
    return this.emailTemplateService.update(
      authToken,
      templateCode,
      updateEmailTemplateDto,
    );
  }
}
