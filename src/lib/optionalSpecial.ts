import { z } from 'zod';

export function optionalSpecial<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (v) => v === '' ? null : v,
    schema.nullable().optional()
  );
}