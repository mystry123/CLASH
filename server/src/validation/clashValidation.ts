import e from "express";
import { z } from "zod";

export const clashSchema = z.object({
  title: z
    .string({ message: "Title is required." })
    .min(3, { message: "Title must have min 3 char" }),
  description: z
    .string({ message: "Description is required." })
    .min(10, { message: "Description must have min 10 char" }),
  expire_at: z
    .string({ message: "Date is required." })
    .min(5, { message: "Please pass corect Date." }),
  image: z.string({ message: "Image is required." }).optional(),
  
});
