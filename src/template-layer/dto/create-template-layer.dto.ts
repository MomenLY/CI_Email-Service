import { IsNotEmpty } from 'class-validator';

export class CreateTemplateLayerDto {
  @IsNotEmpty()
  TLTemplateLayer: string;
}
