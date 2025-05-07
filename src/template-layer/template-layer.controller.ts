import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Headers,
} from '@nestjs/common';
import { TemplateLayerService } from './template-layer.service';
import { CreateTemplateLayerDto } from './dto/create-template-layer.dto';
import { UpdateTemplateLayerDto } from './dto/update-template-layer.dto';

@Controller('templateLayer')
export class TemplateLayerController {
  constructor(private readonly templateLayerService: TemplateLayerService) {}

  @Post()
  create(
    @Body() createTemplateLayerDto: CreateTemplateLayerDto,
    @Headers('Auth-Code') authToken: string,
  ) {
    return this.templateLayerService.create(createTemplateLayerDto, authToken);
  }

  @Get()
  findAll(@Headers('Auth-Code') authToken: string) {
    return this.templateLayerService.findAll(authToken);
  }

  @Put()
  update(
    @Headers('Auth-Code') authToken: string,
    @Body() updateTemplateLayerDto: UpdateTemplateLayerDto,
  ) {
    return this.templateLayerService.update(updateTemplateLayerDto, authToken);
  }
}
