/**
 * Domain errors carry no HTTP knowledge: the presentation layer maps each
 * `kind` to a status code (see DomainExceptionFilter).
 */
export type DomainErrorKind =
  | 'not_found'
  | 'conflict'
  | 'unauthorized'
  | 'forbidden'
  | 'invalid'
  | 'unavailable';

export abstract class DomainError extends Error {
  abstract readonly kind: DomainErrorKind;

  constructor(
    message: string,
    /** Stable machine-readable code the frontends can switch on. */
    readonly code?: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends DomainError {
  readonly kind = 'not_found' as const;
}

export class ConflictError extends DomainError {
  readonly kind = 'conflict' as const;
}

export class UnauthorizedError extends DomainError {
  readonly kind = 'unauthorized' as const;
}

export class ForbiddenError extends DomainError {
  readonly kind = 'forbidden' as const;
}

export class InvalidInputError extends DomainError {
  readonly kind = 'invalid' as const;
}

export class UnavailableError extends DomainError {
  readonly kind = 'unavailable' as const;
}
