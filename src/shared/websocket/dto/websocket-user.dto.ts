import { ApiProperty } from '@nestjs/swagger';

export class WebSocketUserDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({ description: 'Socket connection ID', example: 'abc123' })
  socketId: string;

  @ApiProperty({ description: 'Connection timestamp' })
  connectedAt: Date;
}
