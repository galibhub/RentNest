import { z } from "zod";

const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(30, "Name cannot exceed 50 characters"),

    email: z
      .string()
      .email("Please provide a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password cannot exceed 20 characters long"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please provide a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password cannot exceed 20 characters long"),
  }),
});

export const AuthValidation = {
  registerSchema,
  loginSchema,
};