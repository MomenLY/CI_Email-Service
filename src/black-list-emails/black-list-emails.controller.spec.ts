import { Test, TestingModule } from '@nestjs/testing';
import { BlackListEmailsController } from './black-list-emails.controller';
import { BlacklistEmailService } from './black-list-emails.service';

describe('BlackListEmailsController', () => {
  let controller: BlackListEmailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlackListEmailsController],
      providers: [BlacklistEmailService],
    }).compile();

    controller = module.get<BlackListEmailsController>(BlackListEmailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
