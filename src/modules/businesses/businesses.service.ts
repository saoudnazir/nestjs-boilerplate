import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { Repository } from 'typeorm';
import { BusinessAccess } from './entities/business-access.entity';
import { Role } from '../../guards/roles.guard';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,

    @InjectRepository(BusinessAccess)
    private readonly businessAccessRepo: Repository<BusinessAccess>,
  ) {}
  create(createBusinessDto: CreateBusinessDto, userId: string, role: Role) {
    return this.businessRepo.save({
      ...createBusinessDto,
      businessAccesses: [
        {
          userId,
          role,
        },
      ],
    });
  }

  findAll(userId: string) {
    return this.businessRepo.find({
      where: {
        businessAccesses: {
          userId,
        },
      },
    });
  }

  findOne(id: string, userId: string) {
    return this.businessRepo.findOne({
      where: { id, businessAccesses: { userId } },
    });
  }

  update(id: string, updateBusinessDto: UpdateBusinessDto) {
    return this.businessRepo.update(id, updateBusinessDto);
  }

  softDelete(id: string) {
    return this.businessRepo.softDelete(id);
  }

  delete(id: string) {
    return this.businessRepo.delete(id);
  }

  findAccess(
    userId: string,
    businessId: string,
  ): Promise<BusinessAccess | null> {
    return this.businessAccessRepo.findOne({
      where: { userId, businessId },
    });
  }

  async removeAccess(userId: string, businessId: string) {
    const access = await this.findAccess(userId, businessId);

    if (!access) {
      throw new Error('Access not found');
    }

    if (access.role === Role.OWNER) {
      throw new Error('An owner cannot be removed');
    }

    return this.businessAccessRepo.softDelete({
      userId,
      businessId,
    });
  }

  restoreAccess(userId: string, businessId: string) {
    return this.businessAccessRepo.restore({
      userId,
      businessId,
    });
  }
}
