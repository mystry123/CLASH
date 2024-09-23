import { Router, Request, Response } from "express";
import prisma from "../config/database";

const router = Router();

router.get("/verify-email", async (req: Request, res: Response) => {
  const { email, token } = req.query;

  console.log(req.query);
  if (email && token) {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toString(),
      },
    });

    if (user) {
      if (token === user.email_verify_token) {
        await prisma.user.update({
          where: {
            email: email.toString(),
          },
          data: {
            email_verified_at: new Date().toISOString(),
            email_verify_token: null,
          },
        });
        return res.redirect(`${process.env.CLIENT_APP_URL}/login`);
      }
      return res.redirect("verify-error");
    }
  }
  return res.redirect("verify-error");
});


router.get("/verify-error", async (req: Request, res: Response) => {
  return res.render("emailVerifyUrl");
});

export default router;
