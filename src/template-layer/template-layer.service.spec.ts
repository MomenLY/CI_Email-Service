import { Test, TestingModule } from '@nestjs/testing';
import { TemplateLayerService } from './template-layer.service';

describe('TemplateLayerService', () => {
  let service: TemplateLayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateLayerService],
    }).compile();

    service = module.get<TemplateLayerService>(TemplateLayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
