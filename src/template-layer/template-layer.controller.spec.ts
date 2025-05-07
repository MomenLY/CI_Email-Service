import { Test, TestingModule } from '@nestjs/testing';
import { TemplateLayerController } from './template-layer.controller';
import { TemplateLayerService } from './template-layer.service';

describe('TemplateLayerController', () => {
  let controller: TemplateLayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateLayerController],
      providers: [TemplateLayerService],
    }).compile();

    controller = module.get<TemplateLayerController>(TemplateLayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
