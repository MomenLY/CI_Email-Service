import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateEmailDto {
  @IsNotEmpty()
  templateCode: string;

  @IsNotEmpty()
  data: object;

  @IsNotEmpty()
  @IsArray()
  to: string[];

  @IsOptional()
  @IsArray()
  cc: string[];

  @IsArray()
  @IsOptional()
  bcc: string[];

  @IsNotEmpty()
  multiThread: boolean;
}
