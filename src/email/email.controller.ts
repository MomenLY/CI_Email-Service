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

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

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
}
