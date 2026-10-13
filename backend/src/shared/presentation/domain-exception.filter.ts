import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainError, type DomainErrorKind } from '../domain/errors.js';

const STATUS_BY_KIND: Record<DomainErrorKind, HttpStatus> = {
  not_found: HttpStatus.NOT_FOUND,
  conflict: HttpStatus.CONFLICT,
  unauthorized: HttpStatus.UNAUTHORIZED,
  forbidden: HttpStatus.FORBIDDEN,
  invalid: HttpStatus.BAD_REQUEST,
  unavailable: HttpStatus.SERVICE_UNAVAILABLE,
};

/**
 * Translates domain errors into HTTP responses with the same shape Nest uses
 * for its own errors, plus an optional `code` and `details`.
 */
@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const statusCode = STATUS_BY_KIND[error.kind];
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(statusCode)
      .json({
        statusCode,
        error: HttpStatus[statusCode],
        message: error.message,
        ...(error.code && { code: error.code }),
        ...(error.details && { details: error.details }),
      });
  }
}
