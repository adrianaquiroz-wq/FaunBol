import { NotFoundError } from '../../shared/domain/errors.js';
import type { UserFilters, UserRepository } from '../domain/ports.js';
import type { User } from '../domain/user.js';

export class ListUsersUseCase {
  constructor(private readonly users: UserRepository) {}

  execute(filters: UserFilters): Promise<User[]> {
    return this.users.findAll(filters);
  }
}

/** Admin decisions on researcher accounts: approve, reject, disable. */
export class ReviewUserUseCase {
  constructor(private readonly users: UserRepository) {}

  approve(id: string): Promise<User> {
    return this.change(id, (user) => user.approve());
  }

  reject(id: string, reason?: string | null): Promise<User> {
    return this.change(id, (user) => user.reject(reason));
  }

  disable(id: string): Promise<User> {
    return this.change(id, (user) => user.disable());
  }

  private async change(id: string, apply: (user: User) => void) {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundError(`User "${id}" not found`, 'USER_NOT_FOUND');
    }
    apply(user);
    await this.users.save(user);
    return user;
  }
}
