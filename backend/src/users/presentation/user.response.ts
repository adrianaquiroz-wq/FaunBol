import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole, UserStatus } from '../domain/user.js';

/** Public view of a user: never exposes the password hash. */
export class UserResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  institution: string;

  @ApiProperty({ nullable: true, type: String })
  requestReason: string | null;

  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  role: UserRole;

  @ApiProperty({ enum: UserStatus, enumName: 'UserStatus' })
  status: UserStatus;

  @ApiProperty({ nullable: true, type: String })
  rejectionReason: string | null;

  @ApiProperty()
  createdAt: Date;

  static from(user: User): UserResponse {
    const { passwordHash: _, updatedAt: __, ...rest } = user.toProps();
    return rest;
  }
}

export class LoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserResponse })
  user: UserResponse;
}
