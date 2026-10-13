import {
  applyDecorators,
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import {
  ForbiddenError,
  UnauthorizedError,
} from '../../shared/domain/errors.js';
import { AuthenticateTokenUseCase } from '../application/auth.use-cases.js';
import type { User, UserRole } from '../domain/user.js';

const ROLES_KEY = 'faunbol:roles';

type AuthenticatedRequest = Request & { user?: User };

/**
 * Authenticates the bearer token and, when roles are declared with @Auth(),
 * checks the user has one of them.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authenticate: AuthenticateTokenUseCase,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = (request.headers.authorization ?? '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedError('Missing bearer token', 'MISSING_TOKEN');
    }

    const user = await this.authenticate.execute(token);
    const roles = this.reflector.getAllAndOverride<UserRole[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (roles?.length && !roles.includes(user.role)) {
      throw new ForbiddenError(
        'You do not have permission for this action',
        'INSUFFICIENT_ROLE',
      );
    }

    request.user = user;
    return true;
  }
}

/** Requires a valid token; with roles, also one of those roles. */
export const Auth = (...roles: UserRole[]) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Missing or invalid token' }),
    ApiForbiddenResponse({
      description: 'Account not approved or role not allowed',
    }),
  );

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): User =>
    ctx.switchToHttp().getRequest<AuthenticatedRequest>().user!,
);
