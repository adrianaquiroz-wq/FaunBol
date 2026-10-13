import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  LoginUseCase,
  RegisterResearcherUseCase,
} from '../application/auth.use-cases.js';
import type { User } from '../domain/user.js';
import { Auth, CurrentUser } from './auth.guard.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';
import { LoginResponse, UserResponse } from './user.response.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerResearcher: RegisterResearcherUseCase,
    private readonly login: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Researcher sign-up (account stays PENDING until approved)',
  })
  @ApiCreatedResponse({ type: UserResponse })
  @ApiConflictResponse({ description: 'Email already registered' })
  async register(@Body() dto: RegisterDto): Promise<UserResponse> {
    return UserResponse.from(await this.registerResearcher.execute(dto));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in and get a JWT (valid for 8 hours)' })
  @ApiOkResponse({ type: LoginResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiForbiddenResponse({
    description:
      'Account pending, rejected or disabled (see `code`: ACCOUNT_PENDING, ACCOUNT_REJECTED, ACCOUNT_DISABLED)',
  })
  async signIn(@Body() dto: LoginDto): Promise<LoginResponse> {
    const { accessToken, user } = await this.login.execute(dto);
    return { accessToken, user: UserResponse.from(user) };
  }

  @Get('me')
  @Auth()
  @ApiOperation({ summary: 'Current user' })
  @ApiOkResponse({ type: UserResponse })
  me(@CurrentUser() user: User): UserResponse {
    return UserResponse.from(user);
  }
}
