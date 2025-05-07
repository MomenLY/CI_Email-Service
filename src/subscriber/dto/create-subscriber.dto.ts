import { IsNotEmpty } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty()
  SAccountId: string;

  SFromEmailId: string;

  SProviderId: string;
}
