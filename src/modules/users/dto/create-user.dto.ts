import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../../guards/roles.guard';

export class CreateUserDto {
  @ApiProperty({
    description: 'User Email',
    example: 'user@domain.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User Password',
    example: 'User@1234',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User Name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}

export class CreateUserWithBusinessDto extends OmitType(CreateUserDto, [
  'role',
]) {
  @ApiProperty({
    description: 'Business Name',
    example: 'Business Name',
  })
  @IsString()
  @IsNotEmpty()
  businessName: string;
}
