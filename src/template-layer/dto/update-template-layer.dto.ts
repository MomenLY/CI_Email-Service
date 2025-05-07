import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateLayerDto } from './create-template-layer.dto';

export class UpdateTemplateLayerDto extends PartialType(CreateTemplateLayerDto) {}
