import type { User, UserRole, UserStatus } from './user.js';

export interface UserFilters {
  status?: UserStatus;
  role?: UserRole;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(filters: UserFilters): Promise<User[]>;
  save(user: User): Promise<void>;
}

export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export interface TokenService {
  sign(payload: TokenPayload): Promise<string>;
  /** Returns null when the token is invalid or expired. */
  verify(token: string): Promise<TokenPayload | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');
export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
