import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from '../guards';
import { PublicRoute } from './public-route.decorator';
import { Role } from '@prisma/client';

export function Auth(
  roles: Role[] = [],
  options?: { public: boolean },
): MethodDecorator {
  const isPublicRoute = options?.public ?? false;

  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute),
  );
}
