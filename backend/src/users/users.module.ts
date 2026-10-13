import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import {
  AuthenticateTokenUseCase,
  LoginUseCase,
  RegisterResearcherUseCase,
} from './application/auth.use-cases.js';
import {
  ListUsersUseCase,
  ReviewUserUseCase,
} from './application/user-review.use-cases.js';
import {
  PASSWORD_HASHER,
  TOKEN_SERVICE,
  USER_REPOSITORY,
  type PasswordHasher,
  type TokenService,
  type UserRepository,
} from './domain/ports.js';
import {
  BcryptPasswordHasher,
  JwtTokenService,
  TypeOrmUserRepository,
} from './infrastructure/adapters.js';
import { UserOrmEntity } from './infrastructure/user.orm-entity.js';
import { AuthController } from './presentation/auth.controller.js';
import { AuthGuard } from './presentation/auth.guard.js';
import { UsersController } from './presentation/users.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET is not set in .env');
        return {
          secret,
          signOptions: {
            expiresIn: (process.env.JWT_EXPIRES_IN ?? '8h') as `${number}h`,
          },
        };
      },
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    // Ports → adapters
    {
      provide: USER_REPOSITORY,
      useFactory: (repository: Repository<UserOrmEntity>) =>
        new TypeOrmUserRepository(repository),
      inject: [getRepositoryToken(UserOrmEntity)],
    },
    { provide: PASSWORD_HASHER, useFactory: () => new BcryptPasswordHasher() },
    {
      provide: TOKEN_SERVICE,
      useFactory: (jwt: JwtService) => new JwtTokenService(jwt),
      inject: [JwtService],
    },
    // Use cases
    {
      provide: RegisterResearcherUseCase,
      useFactory: (users: UserRepository, hasher: PasswordHasher) =>
        new RegisterResearcherUseCase(users, hasher),
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        users: UserRepository,
        hasher: PasswordHasher,
        tokens: TokenService,
      ) => new LoginUseCase(users, hasher, tokens),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE],
    },
    {
      provide: AuthenticateTokenUseCase,
      useFactory: (users: UserRepository, tokens: TokenService) =>
        new AuthenticateTokenUseCase(users, tokens),
      inject: [USER_REPOSITORY, TOKEN_SERVICE],
    },
    {
      provide: ListUsersUseCase,
      useFactory: (users: UserRepository) => new ListUsersUseCase(users),
      inject: [USER_REPOSITORY],
    },
    {
      provide: ReviewUserUseCase,
      useFactory: (users: UserRepository) => new ReviewUserUseCase(users),
      inject: [USER_REPOSITORY],
    },
    AuthGuard,
  ],
  // Other modules protect their routes with @Auth(), which needs these.
  exports: [AuthenticateTokenUseCase, AuthGuard],
})
export class UsersModule {}
