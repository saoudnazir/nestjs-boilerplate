import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  OWNER = 'owner',
}

const RoleLabels: {
  [key in Role]: string;
} = {
  [Role.USER]: 'User',
  [Role.ADMIN]: 'Admin',
  [Role.OWNER]: 'Owner',
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!!!user) {
      throw new Error('Role check failed. Error: User not found');
    }
    const roleExists = requiredRoles.includes(user.role);

    if (!roleExists) {
      throw new Error(
        `Role check failed. Error: User does not have the required role(s) (${requiredRoles.map((role) => RoleLabels[role]).join(', ')})`,
      );
    }
    return roleExists;
  }
}
