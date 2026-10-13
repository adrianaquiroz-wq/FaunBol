import {
  ConflictError,
  UnauthorizedError,
} from '../../shared/domain/errors.js';
import type {
  PasswordHasher,
  TokenService,
  UserRepository,
} from '../domain/ports.js';
import { User } from '../domain/user.js';

export interface RegisterResearcherCommand {
  fullName: string;
  email: string;
  password: string;
  institution: string;
  requestReason?: string | null;
}

/** Sign-up: the researcher is stored as PENDING until an admin reviews it. */
export class RegisterResearcherUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(command: RegisterResearcherCommand): Promise<User> {
    const email = User.normalizeEmail(command.email);
    if (await this.users.findByEmail(email)) {
      throw new ConflictError(
        'An account with this email already exists',
        'EMAIL_TAKEN',
      );
    }
    const user = User.registerResearcher({
      ...command,
      email,
      passwordHash: await this.hasher.hash(command.password),
    });
    await this.users.save(user);
    return user;
  }
}

export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  user: User;
}

export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user = await this.users.findByEmail(
      User.normalizeEmail(command.email),
    );
    // Password is checked before the status so a wrong password never
    // reveals whether an account exists or is pending.
    const valid =
      user && (await this.hasher.compare(command.password, user.passwordHash));
    if (!user || !valid) {
      throw new UnauthorizedError(
        'Invalid email or password',
        'INVALID_CREDENTIALS',
      );
    }
    user.ensureCanSignIn();
    const accessToken = await this.tokens.sign({
      sub: user.id,
      role: user.role,
    });
    return { accessToken, user };
  }
}

/**
 * Resolves the user behind a bearer token. The account is re-read on every
 * request, so disabling a user takes effect immediately, not when the token
 * expires.
 */
export class AuthenticateTokenUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly tokens: TokenService,
  ) {}

  async execute(token: string): Promise<User> {
    const payload = await this.tokens.verify(token);
    const user = payload && (await this.users.findById(payload.sub));
    if (!user) {
      throw new UnauthorizedError('Invalid or expired token', 'INVALID_TOKEN');
    }
    user.ensureCanSignIn();
    return user;
  }
}
