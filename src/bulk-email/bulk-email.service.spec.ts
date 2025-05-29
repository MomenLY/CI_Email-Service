import { Test, TestingModule } from '@nestjs/testing';
import { BulkEmailService } from './bulk-email.service';

describe('BulkEmailService', () => {
  let service: BulkEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BulkEmailService],
    }).compile();

    service = module.get<BulkEmailService>(BulkEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
