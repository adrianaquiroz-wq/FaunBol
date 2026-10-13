import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import type {
  PasswordHasher,
  TokenPayload,
  TokenService,
  UserFilters,
  UserRepository,
} from '../domain/ports.js';
import { User } from '../domain/user.js';
import { UserOrmEntity } from './user.orm-entity.js';

export class TypeOrmUserRepository implements UserRepository {
  constructor(private readonly repository: Repository<UserOrmEntity>) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.repository.findOneBy({ id });
    return row && User.restore(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.repository.findOneBy({ email });
    return row && User.restore(row);
  }

  async findAll(filters: UserFilters): Promise<User[]> {
    const rows = await this.repository.find({
      where: { status: filters.status, role: filters.role },
      order: { createdAt: 'DESC' },
    });
    return rows.map((row) => User.restore(row));
  }

  async save(user: User): Promise<void> {
    await this.repository.save(this.repository.create(user.toProps()));
  }
}

export class BcryptPasswordHasher implements PasswordHasher {
  constructor(private readonly rounds = 10) {}

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}

export class JwtTokenService implements TokenService {
  constructor(private readonly jwt: JwtService) {}

  sign(payload: TokenPayload): Promise<string> {
    return this.jwt.signAsync({ ...payload });
  }

  async verify(token: string): Promise<TokenPayload | null> {
    try {
      const { sub, role } = await this.jwt.verifyAsync<TokenPayload>(token);
      return { sub, role };
    } catch {
      return null;
    }
  }
}
