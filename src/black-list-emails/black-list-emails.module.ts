// import { Module } from '@nestjs/common';
// import { BlackListEmailsService } from './black-list-emails.service';
// import { BlackListEmailsController } from './black-list-emails.controller';

// @Module({
//   controllers: [BlackListEmailsController],
//   providers: [BlackListEmailsService],
// })
// export class BlackListEmailsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistEmail } from './entities/black-list-email.entity';
import { BlacklistEmailService } from './black-list-emails.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlacklistEmail])],
  providers: [BlacklistEmailService],
  exports: [BlacklistEmailService],
})
export class BlacklistEmailModule {}
