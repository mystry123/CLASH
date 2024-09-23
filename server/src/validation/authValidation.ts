import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string({ message: "Name is required." })
      .min(3, { message: "Name must have min 3 char" }),
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


  // login schema
export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required." })
    .email({ message: "Please type a correct email." }),
  password: z
    .string({ message: "Password is required." })
    .min(6, { message: "Password must have min 6 char" }),
});