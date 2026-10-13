import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserRole, UserStatus } from '../../domain/user.js';

export class ListUsersQueryDto {
  @ApiPropertyOptional({ enum: UserStatus, enumName: 'UserStatus' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ enum: UserRole, enumName: 'UserRole' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class RejectUserDto {
  @ApiPropertyOptional({
    example: 'No pudimos verificar tu afiliación institucional',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}
