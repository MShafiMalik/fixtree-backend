import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthCredentialsBaseDto } from '../../../../../modules/auth/dto/requests/auth-credentials-base.dto';

export class CreateAdminDto extends AuthCredentialsBaseDto {
  @ApiProperty({ description: 'Admin full name', example: 'Jane Admin' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;
}
