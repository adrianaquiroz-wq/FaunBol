import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiQuery } from '@nestjs/swagger';
import type { Request } from 'express';
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  type Language,
} from '../domain/language.js';

/**
 * Resolves the response language: `?lang=` wins, then the first supported
 * language in `Accept-Language`, then Spanish.
 */
export const RequestLanguage = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Language => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const fromQuery = request.query.lang;
    if (isLanguage(fromQuery)) return fromQuery;

    const header = request.headers['accept-language'] ?? '';
    for (const part of header.split(',')) {
      const code = part.trim().slice(0, 2).toLowerCase();
      if (isLanguage(code)) return code;
    }
    return DEFAULT_LANGUAGE;
  },
);

/** Swagger docs for the language selection on localized endpoints. */
export const ApiLanguage = () =>
  applyDecorators(
    ApiQuery({
      name: 'lang',
      required: false,
      enum: ['es', 'en'],
      description: 'Response language (falls back to Spanish)',
    }),
    ApiHeader({ name: 'Accept-Language', required: false }),
  );
