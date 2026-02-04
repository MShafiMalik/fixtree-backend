import { IsNotEmpty, IsString } from 'class-validator';

export class ResendPhoneVerificationDto {
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be a string' })
  phone: string;
}
