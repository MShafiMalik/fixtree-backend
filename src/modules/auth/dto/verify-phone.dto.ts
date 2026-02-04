import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPhoneDto {
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be a string' })
  phone: string;

  @IsNotEmpty({ message: 'Verification code is required' })
  @IsString({ message: 'Verification code must be a string' })
  code: string;
}
