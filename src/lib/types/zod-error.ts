import { ZodError } from 'zod';

export type FieldErrors = Record<
  string,
  string[] | undefined
>;

export function zodFieldErrors(error: ZodError) {
  return error.issues.reduce((acc: Record<string, string[]>, issue) => {
    // const key = issue.path[0] as string; // for simple flat objects, we take the first path segment as the key
    const key = issue.path.join("."); // supports nested fields

    // if (!acc[key]) acc[key] = [];
    // or
    acc[key] ??= [];

    acc[key].push(issue.message);

    return acc;
  }, {});
}