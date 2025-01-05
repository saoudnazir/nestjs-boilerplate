import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Or, Repository } from 'typeorm';
import { Role } from '../../guards/roles.guard';
import { BusinessesService } from '../businesses/businesses.service';
import {
  CreateUserDto,
  CreateUserWithBusinessDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,

    private readonly businessesService: BusinessesService,
  ) {}

  doesEmailExist(email: string) {
    return this.userRepo.exists({ where: { email } });
  }

  async create(createUserDto: CreateUserDto, businessId: string, role: Role) {
    const { email } = createUserDto;
    const userExists = await this.doesEmailExist(email);
    if (userExists) {
      throw new Error(`user with email ${email} already exists`);
    }
    const createdUser = await this.userRepo.save({
      ...createUserDto,

      businessAccesses: [
        {
          businessId,
          role,
        },
      ],
    });

    delete createdUser.password;
    return createdUser;
  }

  async createWithBusiness({
    businessName,
    ...user
  }: CreateUserWithBusinessDto) {
    const emailExist = await this.doesEmailExist(user.email);

    if (emailExist) {
      throw new Error(`user with email ${user.email} already exists`);
    }

    let createdUser = await this.userRepo.save({
      ...user,
      businessAccesses: [
        {
          business: {
            name: businessName,
          },
          role: Role.OWNER,
        },
      ],
    });

    return createdUser;
  }

  findAllUsers(businessId: string) {
    return this.userRepo.find({
      where: {
        businessAccesses: {
          businessId,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        businessAccesses: {
          role: true,
        },
      },
      relations: ['businessAccesses'],
    });
  }

  async findOneUserByID(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: {
        email: true,
        id: true,
        name: true,
      },
    });
    if (!user) {
      throw new Error(`user with id ${id} does not exists`);
    }

    const access = await this.businessesService.findAccess(
      user.id,
      user.defaultBusinessId,
    );

    return { user, access };
  }

  async findOneUserByEmail(email: string, withPassword = false) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: {
        email: true,
        id: true,
        password: withPassword,
        name: true,
      },
    });
    if (!user) {
      throw new Error(`user with email ${email} does not exists`);
    }

    const access = await this.businessesService.findAccess(
      user.id,
      user.defaultBusinessId,
    );

    return { user, access };
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepo.update({ id }, updateUserDto);
  }

  revokeBusinessAccess(id: string, businessId: string) {
    return this.businessesService.removeAccess(id, businessId);
  }

  restoreBusinessAccess(userId: string, businessId: string) {
    return this.businessesService.restoreAccess(userId, businessId);
  }
}
