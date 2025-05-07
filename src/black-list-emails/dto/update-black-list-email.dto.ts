import { PartialType } from '@nestjs/mapped-types';
import { CreateBlackListEmailDto } from './create-black-list-email.dto';

export class UpdateBlackListEmailDto extends PartialType(CreateBlackListEmailDto) {}
