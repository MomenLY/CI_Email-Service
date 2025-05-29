import { PartialType } from '@nestjs/mapped-types';
import { CreateBulkEmailDto } from './create-bulk-email.dto';

export class UpdateBulkEmailDto extends PartialType(CreateBulkEmailDto) {}
