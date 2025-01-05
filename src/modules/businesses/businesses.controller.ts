import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Requestor } from '../../decorators/requestor.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { Role, RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Roles(Role.OWNER)
  @Post()
  create(
    @Body() createBusinessDto: CreateBusinessDto,
    @Requestor() requestor: Requestor,
  ) {
    return this.businessesService.create(
      createBusinessDto,
      requestor.id,
      Role.OWNER,
    );
  }

  @Get()
  findAll(@Requestor() requestor: Requestor) {
    return this.businessesService.findAll(requestor.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Requestor() requestor: Requestor) {
    return this.businessesService.findOne(id, requestor.id);
  }

  @Roles(Role.OWNER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(id, updateBusinessDto);
  }

  @Roles(Role.OWNER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessesService.softDelete(id);
  }
}
