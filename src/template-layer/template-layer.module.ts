import { Module } from '@nestjs/common';
import { TemplateLayerService } from './template-layer.service';
import { TemplateLayerController } from './template-layer.controller';
import { ServicesService } from 'src/services/services.service';

@Module({
  controllers: [TemplateLayerController],
  providers: [TemplateLayerService, ServicesService],
})
export class TemplateLayerModule {}
