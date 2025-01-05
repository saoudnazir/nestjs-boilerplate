import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

class CommonProps {
  @ApiProperty({
    type: 'string',
    description: 'User Email',
    example: 'user@domain.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'User Password',
    example: 'User@1234',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class LoginDto extends CommonProps {}
export class RegisterDto extends CommonProps {
  @ApiProperty({
    description: 'User Name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Business Name',
    example: 'Business Name',
  })
  @IsString()
  @IsNotEmpty()
  businessName: string;
}
