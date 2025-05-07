import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistEmailService } from './black-list-emails.service';

describe('BlackListEmailsService', () => {
  let service: BlacklistEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlacklistEmailService],
    }).compile();

    service = module.get<BlacklistEmailService>(BlacklistEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
