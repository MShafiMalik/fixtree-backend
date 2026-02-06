import { IsUUID } from 'class-validator';

export class CreateSellerDto {
  @IsUUID()
  userId: string;
}
