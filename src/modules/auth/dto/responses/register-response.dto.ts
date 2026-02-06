import { UserResponseDto } from './user-response.dto';

export class RegisterResponseDto {
  message: string;
  verificationRequired: boolean;
  user: UserResponseDto;
}
