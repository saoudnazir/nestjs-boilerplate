import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Ip,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { getPlatformAndBrowser } from '../../utils/get-request-info';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @Post('/register')
  create(@Body() createUserDto: RegisterDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('/signin')
  signIn(
    @Body() createUserDto: LoginDto,
    @Ip() ip: string,
    @Headers() headers: Record<string, string>,
  ) {
    const { 'user-agent': userAgent } = headers;

    const requestSource = getPlatformAndBrowser(userAgent);

    const { email, password } = createUserDto;

    return this.authService.signInUser(email, password, {
      ...requestSource,
      ip,
    });
  }

  @ApiBearerAuth()
  @Get('/refresh-token/:id')
  refreshToken(
    @Param('id') id: string,
    @Headers() headers: Record<string, string>,
    @Ip() ip: string,
  ) {
    const { authorization } = headers;
    if (!authorization) {
      throw new Error('Auth Token is required');
    }
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') {
      throw new Error('Invalid token type');
    }

    const { id: userIdFromToken } = this.authService.verifyToken(token, true);

    const { 'user-agent': userAgent } = headers;

    const requestSource = getPlatformAndBrowser(userAgent);

    return this.authService.refreshToken(id, userIdFromToken, {
      ...requestSource,
      ip,
    });
  }
}
