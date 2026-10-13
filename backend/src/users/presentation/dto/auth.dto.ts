import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'María Choque', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName: string;

  @ApiProperty({ example: 'maria@umsa.bo' })
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({ minLength: 8, maxLength: 72, example: 'S3gura!2026' })
  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt only uses the first 72 bytes
  password: string;

  @ApiProperty({ example: 'Museo Nacional de Historia Natural' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  institution: string;

  @ApiPropertyOptional({ example: 'Investigo anfibios del lago Titicaca' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  requestReason?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'admin@faunbol.bo' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
