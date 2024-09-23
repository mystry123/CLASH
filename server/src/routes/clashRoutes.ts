import { Router, Request, Response } from "express";
import { clashSchema } from "../validation/clashValidation";
import { UploadedFile } from "express-fileupload";
import {
  deleteFile,
  formatZodError,
  imageValidator,
  uploadFile,
} from "../helper";
import prisma from "../config/database";
import { ZodError } from "zod";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const payload = clashSchema.parse(body);

    // check if file is uploaded

    if (req.files?.image) {
      const image = req.files.image as UploadedFile;
      const validationMessage = imageValidator(image.size, image.mimetype);
      if (validationMessage) {
        return res.status(400).json({ errors: { image: validationMessage } });
      }
      payload.image = await uploadFile(image);
    } else {
      res.status(422).json({ errors: { image: "Image is required" } });
    }
    await prisma.takkle.create({
      data: {
        title: payload.title,
        description: payload.description,
        image: payload.image,
        user_id: req.user?.id!,
        expires_at: new Date(payload.expire_at),
      },
    });

    return res.status(201).json({ message: "Clash created successfully" });
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

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await prisma.takkle.findMany({
      where: {
        user_id: req.user?.id!,
      },
    });

    return res
      .status(201)
      .json({ message: "Takkle fetched successfully", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const data = await prisma.takkle.findMany({
      where: {
        id: Number(req.params.id),
      },
    });

    return res
      .status(201)
      .json({ message: "Takkle fetched successfully", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const { id } = req.params;
    const payload = clashSchema.parse(body);

    // check if file is uploaded

    if (req.files?.image) {
      const image = req.files.image as UploadedFile;
      const validationMessage = imageValidator(image.size, image.mimetype);
      if (validationMessage) {
        return res.status(400).json({ errors: { image: validationMessage } });
      }
      const takkle = await prisma.takkle.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (takkle) deleteFile(takkle.image!);
      payload.image = await uploadFile(image);
    }

    await prisma.takkle.update({
      where: {
        id: Number(id),
      },
      data: {
        title: payload.title,
        description: payload.description,
        image: payload.image,
        user_id: req.user?.id!,
        expires_at: new Date(payload.expire_at),
      },
    });

    return res.status(201).json({ message: "Takkle updated successfully" });
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

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const takkle = await prisma.takkle.findUnique({
      select:{
        image: true,
        id: true
      },
      where: {
        id: Number(req.params.id),
      },
    });
    if (takkle) deleteFile(takkle.image!);

    await prisma.takkle.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    return res.status(201).json({ message: "Takkle deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router; // Export the router to be used in other files
