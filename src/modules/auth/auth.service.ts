import { Injectable, Ip } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { RequestInfo } from '../../utils/get-request-info';
import { Role } from '../../guards/roles.guard';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  createAccessToken(payload: { id: string; role: Role; businessId: string }) {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string, ignoreExpiration = false) {
    return this.jwtService.verify(token, { ignoreExpiration });
  }

  async createUser(createUserDto: RegisterDto) {
    return this.userService.createWithBusiness(createUserDto);
  }

  async signInUser(
    email: string,
    password: string,
    requestInfo: RequestInfo & { ip: string },
  ) {
    const { user, access } = await this.userService.findOneUserByEmail(
      email,
      true,
    );

    if (!user) {
      throw new Error('Invalid Credentials');
    }

    const isPasswordMatching = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatching) {
      throw new Error('Invalid Credentials');
    }
    delete user.password;

    const accessToken = this.createAccessToken({
      id: user.id,
      role: access.role,
      businessId: access.businessId,
    });

    // const refreshToken = await this.refreshTokenRepo.save({
    //   accessToken,
    //   userId: user.id,
    //   expiresAt: moment()
    //     .add(this.configService.get('REFRESH_TOKEN_LIFE_DAYS'), 'days')
    //     .toDate(),
    //   ...requestInfo,
    // });

    const refreshToken = await this.createRefreshToken(
      accessToken,
      user.id,
      requestInfo,
    );

    return {
      user,
      accessToken,
      refreshToken: refreshToken.id,
      role: access.role,
    };
  }

  async createRefreshToken(
    accessToken: string,
    userId: string,
    requestInfo: RequestInfo & { ip: string },
  ) {
    return this.refreshTokenRepo.save({
      accessToken,
      userId: userId,
      expiresAt: moment()
        .add(this.configService.get('REFRESH_TOKEN_LIFE_DAYS'), 'days')
        .toDate(),
      ...requestInfo,
    });
  }

  async refreshToken(
    id: string,
    userIdFromToken: string,
    requestInfo: RequestInfo & { ip: string },
  ) {
    const refreshToken = await this.refreshTokenRepo.findOne({
      where: {
        id,
        expiresAt: MoreThanOrEqual(moment().toDate()),
      },
    });

    if (!refreshToken) {
      throw new Error('Invalid refresh token');
    }

    if (refreshToken.userId !== userIdFromToken) {
      throw new Error('Invalid refresh token');
    }

    const { user, access } =
      await this.userService.findOneUserByID(userIdFromToken);

    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = this.createAccessToken({
      id: user.id,
      role: access.role,
      businessId: access.businessId,
    });

    const newRefreshToken = await this.createRefreshToken(
      accessToken,
      user.id,
      requestInfo,
    );

    await this.refreshTokenRepo.softDelete({ id });

    return {
      user,
      accessToken,
      refreshToken: newRefreshToken.id,
    };
  }
}
