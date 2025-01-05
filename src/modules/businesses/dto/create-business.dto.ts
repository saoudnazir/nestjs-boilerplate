import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({
    description: 'Name of the business',
    example: 'Business Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
