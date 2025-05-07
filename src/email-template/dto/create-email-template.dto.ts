import { IsNotEmpty } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsNotEmpty()
  TName: string;

  @IsNotEmpty()
  TSubject: string;

  @IsNotEmpty()
  TBody: string;

  @IsNotEmpty()
  TMagicQuotes: string;

  @IsNotEmpty()
  TTemplateCode: string;
}
