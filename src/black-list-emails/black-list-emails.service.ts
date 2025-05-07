import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistEmail } from './entities/black-list-email.entity';

@Injectable()
export class BlacklistEmailService {
  constructor(
    @InjectRepository(BlacklistEmail)
    private blacklistEmailRepository: Repository<BlacklistEmail>,
  ) {}

  async addEmailToBlacklist(email: string): Promise<BlacklistEmail> {
    const blacklistEmail = this.blacklistEmailRepository.create({ email: email });
    return this.blacklistEmailRepository.save(blacklistEmail);
  }

  async isEmailBlacklisted(email: string): Promise<boolean> {
    const emailEntry = await this.blacklistEmailRepository.find({ where: { email: email} });
    return !!emailEntry?.length;
  }
}
