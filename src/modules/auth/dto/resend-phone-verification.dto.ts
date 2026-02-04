import { IsString } from 'class-validator';

export class ResendPhoneVerificationDto {
  @IsString()
  phone: string;
}
