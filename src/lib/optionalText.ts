import { z } from 'zod';

export function optionalText<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (v) => v === '' ? null : v,
    schema.nullable().optional()
  );
}