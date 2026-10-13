import { randomUUID } from 'node:crypto';
import { ConflictError, ForbiddenError } from '../../shared/domain/errors.js';

export enum UserRole {
  ADMIN = 'ADMIN',
  RESEARCHER = 'RESEARCHER',
}

/**
 * Lifecycle of an account:
 *   PENDING ──approve──► APPROVED ──disable──► DISABLED
 *      └──────reject───► REJECTED
 */
export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISABLED = 'DISABLED',
}

export interface UserProps {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  institution: string;
  requestReason: string | null;
  role: UserRole;
  status: UserStatus;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUserData {
  fullName: string;
  email: string;
  passwordHash: string;
  institution: string;
  requestReason?: string | null;
}

export class User {
  private constructor(private props: UserProps) {}

  /** A researcher signs up and waits for an admin to review the request. */
  static registerResearcher(data: NewUserData): User {
    return User.create(data, UserRole.RESEARCHER, UserStatus.PENDING);
  }

  /** Admins are created already approved (seed only). */
  static createAdmin(data: NewUserData): User {
    return User.create(data, UserRole.ADMIN, UserStatus.APPROVED);
  }

  static restore(props: UserProps): User {
    return new User({ ...props });
  }

  private static create(
    data: NewUserData,
    role: UserRole,
    status: UserStatus,
  ): User {
    const now = new Date();
    return new User({
      id: randomUUID(),
      fullName: data.fullName.trim(),
      email: User.normalizeEmail(data.email),
      passwordHash: data.passwordHash,
      institution: data.institution.trim(),
      requestReason: data.requestReason?.trim() || null,
      role,
      status,
      rejectionReason: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  get id() {
    return this.props.id;
  }
  get email() {
    return this.props.email;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get role() {
    return this.props.role;
  }
  get status() {
    return this.props.status;
  }

  approve(): void {
    this.ensureResearcher();
    this.ensureStatus(UserStatus.PENDING, 'approve');
    this.transition(UserStatus.APPROVED, null);
  }

  reject(reason?: string | null): void {
    this.ensureResearcher();
    this.ensureStatus(UserStatus.PENDING, 'reject');
    this.transition(UserStatus.REJECTED, reason?.trim() || null);
  }

  disable(): void {
    this.ensureResearcher();
    this.ensureStatus(UserStatus.APPROVED, 'disable');
    this.transition(UserStatus.DISABLED, null);
  }

  /** Throws unless the account is allowed to sign in and use its token. */
  ensureCanSignIn(): void {
    switch (this.props.status) {
      case UserStatus.APPROVED:
        return;
      case UserStatus.PENDING:
        throw new ForbiddenError(
          'Your account is waiting for approval by an administrator',
          'ACCOUNT_PENDING',
        );
      case UserStatus.REJECTED:
        throw new ForbiddenError(
          'Your registration request was rejected',
          'ACCOUNT_REJECTED',
          { reason: this.props.rejectionReason },
        );
      case UserStatus.DISABLED:
        throw new ForbiddenError(
          'Your account has been disabled',
          'ACCOUNT_DISABLED',
        );
    }
  }

  toProps(): UserProps {
    return { ...this.props };
  }

  private transition(status: UserStatus, rejectionReason: string | null) {
    this.props.status = status;
    this.props.rejectionReason = rejectionReason;
    this.props.updatedAt = new Date();
  }

  private ensureResearcher() {
    if (this.props.role !== UserRole.RESEARCHER) {
      throw new ForbiddenError(
        'Only researcher accounts can be reviewed',
        'NOT_A_RESEARCHER',
      );
    }
  }

  private ensureStatus(expected: UserStatus, action: string) {
    if (this.props.status !== expected) {
      throw new ConflictError(
        `Cannot ${action} a user whose status is ${this.props.status}`,
        'INVALID_USER_STATUS',
        { status: this.props.status },
      );
    }
  }
}
