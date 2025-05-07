import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlacklistEmailService } from './black-list-emails.service';
import { CreateBlackListEmailDto } from './dto/create-black-list-email.dto';
import { UpdateBlackListEmailDto } from './dto/update-black-list-email.dto';

@Controller('black-list-emails')
export class BlackListEmailsController {
  constructor(private readonly blackListEmailsService: BlacklistEmailService) {
    
  }
}
