import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ListUsersUseCase,
  ReviewUserUseCase,
} from '../application/user-review.use-cases.js';
import { UserRole } from '../domain/user.js';
import { Auth } from './auth.guard.js';
import { ListUsersQueryDto, RejectUserDto } from './dto/users.dto.js';
import { UserResponse } from './user.response.js';

@ApiTags('Users (admin)')
@Auth(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(
    private readonly listUsers: ListUsersUseCase,
    private readonly reviewUser: ReviewUserUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List users, optionally by status or role' })
  @ApiOkResponse({ type: [UserResponse] })
  async findAll(@Query() query: ListUsersQueryDto): Promise<UserResponse[]> {
    const users = await this.listUsers.execute(query);
    return users.map((user) => UserResponse.from(user));
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a pending researcher' })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'User is not pending' })
  async approve(@Param('id', ParseUUIDPipe) id: string) {
    return UserResponse.from(await this.reviewUser.approve(id));
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a pending researcher (optional reason)' })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'User is not pending' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectUserDto,
  ) {
    return UserResponse.from(await this.reviewUser.reject(id, dto.reason));
  }

  @Patch(':id/disable')
  @ApiOperation({ summary: 'Disable an approved researcher' })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'User is not approved' })
  async disable(@Param('id', ParseUUIDPipe) id: string) {
    return UserResponse.from(await this.reviewUser.disable(id));
  }
}
