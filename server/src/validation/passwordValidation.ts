import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Email is required." })
    .email({ message: "Please type a correct email." }),
});

export const resetPasswordSchema = z
  .object({
    token: z.string({ message: "Token is required." }),
    email: z
      .string({ message: "Email is required." })
      .email({ message: "Please type a correct email." }),
    password: z
      .string({ message: "Password is required." })
      .min(6, { message: "Name must have min 6 char" }),
    confirmPassword: z
      .string({ message: "Password is required." })
      .min(6, { message: "Name must have min 6 char" })
      .max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password must be same",
    path: ["confirmPassword"],
  });
