import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Requestor } from '../../decorators/requestor.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Role, RolesGuard } from '../../guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.OWNER)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Requestor() requestor: Requestor,
  ) {
    return this.usersService.create(
      createUserDto,
      requestor.businessId,
      createUserDto.role,
    );
  }

  @Get()
  findAllUsers(@Requestor() requestor: Requestor) {
    return this.usersService.findAllUsers(requestor.businessId);
  }

  @Get(':id')
  findOneUserByID(@Param('id') id: string) {
    return this.usersService.findOneUserByID(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDTO);
  }

  @Delete('revoke-access/:id')
  remove(@Param('id') id: string, @Requestor() requestor: Requestor) {
    return this.usersService.revokeBusinessAccess(id, requestor.businessId);
  }

  @Put('restore-access/:id')
  restore(@Param('id') id: string, @Requestor() requestor: Requestor) {
    return this.usersService.restoreBusinessAccess(id, requestor.businessId);
  }
}
