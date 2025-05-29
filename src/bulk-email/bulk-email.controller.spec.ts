import { Test, TestingModule } from '@nestjs/testing';
import { BulkEmailController } from './bulk-email.controller';
import { BulkEmailService } from './bulk-email.service';

describe('BulkEmailController', () => {
  let controller: BulkEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulkEmailController],
      providers: [BulkEmailService],
    }).compile();

    controller = module.get<BulkEmailController>(BulkEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
