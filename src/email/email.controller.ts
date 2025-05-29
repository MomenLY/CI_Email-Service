import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { CreateBulkEmailDto } from 'src/bulk-email/dto/create-bulk-email.dto';
import { BulkEmailService } from 'src/bulk-email/bulk-email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService, private bulkEmailService: BulkEmailService) { }

  @Post('send')
  create(
    @Body() createEmailDto: CreateEmailDto,
    @Headers('Auth-Code') authToken: string,
  ) {
    return this.emailService.create(createEmailDto, authToken);
  }

  @Get('queue')
  findAll(@Headers('Auth-Code') authToken: string) {
    if (!authToken) {
      throw new BadRequestException('Auth-Code is required');
    } else {
      return this.emailService.findAll(authToken);
    }
  }

  @Post('bulk')
  async sendBulkEmails(@Body() createBulkEmailDto: any, @Headers('Auth-Code') authToken: string) {
    return this.bulkEmailService.sendBulkEmails(createBulkEmailDto, authToken);
  }
}
