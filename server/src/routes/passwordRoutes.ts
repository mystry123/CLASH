import e, { Router, Request, Response } from "express";
import prisma from "../config/database";
import { authLimiter } from "../config/rateLimit";
import { checkTimeDiff, formatZodError, renderEjs } from "../helper";
import { ZodError } from "zod";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation/passwordValidation";
import bcrypt from "bcrypt";
import { emailQueue, emailQueueNmae } from "../jobs/emailJobs";
import { v4 as uuid4 } from "uuid";

const router = Router();

router.post(
  "/forgot-password",
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const payload = forgotPasswordSchema.parse(body);
      const user = await prisma.user.findFirst({
        where: {
          email:{
            equals:payload.email,
            mode:"insensitive"
          }
        },
      });

      if (!user || user === null) {
        console.log("forgot password user", user);
        return res.status(400).json({
          message: "User not found",
          errors: {
            email: "User not found",
          },
        });
      }

      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(user.email, salt);
      const resetToken = await bcrypt.hash(uuid4(), salt);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password_reset_token: resetToken,
          token_sent_at: new Date().toISOString(),
        },
      });

      const htmlBody = await renderEjs("forgot-password.ejs", {
        domain: process.env.APP_URL,
        email: payload.email,
        token: resetToken,
      });

      await emailQueue.add(emailQueueNmae, {
        to: payload.email,
        subject: "Reset your Password",
        body: htmlBody,
      });

      return res.json({
        message: "Password link sent to your email! please check! ",
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


router.post(
  "/reset-password",
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      console.log(body);
      const payload = resetPasswordSchema.parse(body);

      if (!payload.email || !payload.token) {
        return res.status(400).json({
          message: "Invalid Link",
          errors: {
            email: "Invalid Link",
          },
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          email:{
            equals:payload.email,
            mode:"insensitive"
          }
        },
      });

      if (!user || user === null) {
        return res.status(400).json({
          message: "User not found",
          errors: {
            email: "User not found",
          },
        });
      }

      const timeDiff = checkTimeDiff(user.token_sent_at!);
      if (timeDiff > 2) {
        return res.status(400).json({
          message: "Link Expired",
          errors: {
            email: "Link Expired",
          },
        });
      }

      if (user.password_reset_token !== payload.token) {
        return res.status(400).json({
          message: "Invalid Link",
          errors: {
            email: "Invalid Link",
          },
        });
      }

      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(payload.password, salt);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: newPassword,
          password_reset_token: null,
          token_sent_at: null,
        },
      });

      return res.status(200).json({
        message: "Password reset successfully",
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

export default router;
