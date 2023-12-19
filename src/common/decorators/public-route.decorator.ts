import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE_KEY = 'publicRoute';

export const PublicRoute = (isPublic = false): CustomDecorator =>
  SetMetadata(PUBLIC_ROUTE_KEY, isPublic);
