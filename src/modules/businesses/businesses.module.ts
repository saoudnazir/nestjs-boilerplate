import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { BusinessAccess } from './entities/business-access.entity';

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService],
  imports: [TypeOrmModule.forFeature([Business, BusinessAccess])],
  exports: [BusinessesService],
})
export class BusinessesModule {}
