import { IsArray, IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateBulkEmailDto {
  @IsArray()
  @IsEmail({}, { each: true })
  recipients: string[]; // Array of recipient email addresses

  @IsString()
  templateCode: string; // Email template code to use

  @IsOptional()
  @IsObject()
  data?: object; // Template variables

  @IsOptional()
  @IsString()
  jobId?: string; // Optional job ID for tracking
}