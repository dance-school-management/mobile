import { z } from 'zod';

const LoginFormSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

type LoginFormData = z.infer<typeof LoginFormSchema>;

const RegisterFormSchema = z
  .object({
    name: z.string(),
    surname: z.string(),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type RegisterFormData = z.infer<typeof RegisterFormSchema>;

export { LoginFormSchema, LoginFormData, RegisterFormSchema, RegisterFormData };
