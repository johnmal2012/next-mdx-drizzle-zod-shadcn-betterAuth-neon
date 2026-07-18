import { z } from 'zod';

// register validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required'),

  email: z
    .email('Please enter a valid email'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

// login validation schema
export const loginSchema = z.object({
  email: z
    .email('Please enter a valid email'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

// Password validation schema
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters")
      .max(100, "Current password is too long"),
    
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(100, "New password is too long"),
    //   .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    //     "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    //   ),
    
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Infer the TypeScript type from the schema

export type RegisterFormInput = z.infer<
  typeof registerSchema
>;

export type LoginFormInput = z.infer<
  typeof loginSchema
>;

export type ChangePasswordFormInput = z.infer<typeof changePasswordSchema>;