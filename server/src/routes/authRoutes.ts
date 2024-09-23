import { Router, Request, Response } from "express";
import { loginSchema, registerSchema } from "../validation/authValidation";
import { ZodError } from "zod";
import { formatZodError, renderEjs } from "../helper";
import prisma from "../config/database";
import bcrypt from "bcrypt";
import { v4 as uuid4 } from "uuid";
import { emailQueue, emailQueueNmae } from "../jobs/emailJobs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/authMiddleware";
import { authLimiter } from "../config/rateLimit";

const router = Router();

router.post("/register", authLimiter, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    console.log(body);
    const payload = registerSchema.parse(body);
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: payload.email,
          mode: "insensitive",
        },
      },
    });

    if (user) {
      console.log("exists", user);
      return res.status(400).json({ message: "User already exists" });
    }

    //  encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);
    const token = await bcrypt.hash(uuid4(), salt);

    const emailBody = await renderEjs("email-verify.ejs", {
      domain: process.env.APP_URL,
      email: payload.email,
      token: token,
      name: payload.username,
    });

    //    send email
    await emailQueue.add(emailQueueNmae, {
      to: payload.email,
      subject: "Email Verification",
      body: emailBody,
    });

    const newUser = await prisma.user.create({
      data: {
        email: payload.email,
        username: payload.username,
        password: payload.password,
        email_verify_token: token,
      },
    });

    return res.status(201).json({
      message: "Please check your email we have send you a verification email",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      const formattedError = formatZodError(error);
      return res
        .status(422)
        .json({ message: "Validation Error", errors: formattedError });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// login route

router.post("/login", authLimiter, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = loginSchema.parse(body);

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: payload.email,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payloadJwt = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(payloadJwt, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Logged in succesfull",
      data: {
        ...payloadJwt,
        token: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedError = formatZodError(error);
      return res
        .status(422)
        .json({ message: "Validation Error", errors: formattedError });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// login route check

router.post(
  "/check/credentials",
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const payload = loginSchema.parse(body);

      const user = await prisma.user.findFirst({
        where: {
          email: {
            equals: payload.email,
            mode: "insensitive",
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(payload.password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      return res.status(200).json({
        message: "Logged in succesfull",
        data: {},
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = formatZodError(error);
        return res
          .status(422)
          .json({ message: "Validation Error", errors: formattedError });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
//   get userm

router.get(
  "/user",
  authLimiter,
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = req.user;
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router; // Export the router to be used in other files
