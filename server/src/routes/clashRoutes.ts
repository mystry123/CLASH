import { Router, Request, Response } from "express";
import { clashSchema } from "../validation/clashValidation";
import { FileArray, UploadedFile } from "express-fileupload";
import {
  deleteFile,
  formatZodError,
  imageValidator,
  uploadFile,
} from "../helper";
import prisma from "../config/database";
import { ZodError } from "zod";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, async (req: Request, res: Response) => {
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
    await prisma.clash.create({
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

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = await prisma.clash.findMany({
      where: {
        user_id: req.user?.id!,
      },
      orderBy: {
        id: "desc",
      },
    });
    console.log("datass", data);
    return res
      .status(200)
      .json({ message: "Takkle fetched successfully", data });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    console.log("params", req.params);
    const data = await prisma.clash.findMany({
      where: {
        id: Number(req.params.id),
      },
      include: {
        ClashItem: {
          select: {
            image: true,
            id: true,
            count: true,
          },
        },
        ClashComment: {
          select: {
            comment: true,
            id: true,
            created_at: true,
          },
          orderBy: {
            id: "desc",
          },
        },
      },
    });

    return res
      .status(201)
      .json({ message: "Takkle fetched successfully", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
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
      const takkle = await prisma.clash.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (takkle) deleteFile(takkle.image!);
      payload.image = await uploadFile(image);
    }

    await prisma.clash.update({
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

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const takkle = await prisma.clash.findUnique({
      select: {
        image: true,
        id: true,
      },
      where: {
        id: Number(req.params.id),
      },
    });
    if (takkle) deleteFile(takkle.image!);

    await prisma.clash.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    return res.status(201).json({ message: "Takkle deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/items", authMiddleware, async (req: Request, res: Response) => {
  try {
    const files: FileArray | null | undefined = req.files;
    const { id } = req.body;
    let imageError: Array<string> = [];
    const images = files?.["images[]"] as UploadedFile[];
    console.log("testss", id, images);
    if (images.length >= 2) {
      // check vaildation
      images.map((img) => {
        const validImg = imageValidator(img?.size, img?.mimetype);
        if (validImg) imageError.push(validImg);
      });

      if (imageError.length > 0) {
        return res.status(422).json({ errors: imageError });
      }

      let uploadedImages: string[] = [];
      images.map((img) => {
        uploadedImages.push(uploadFile(img));
      });

      uploadedImages.map(async (item) => {
        await prisma.clashItem.create({
          data: {
            image: item,
            clash_id: Number(id),
          },
        });
      });

      return res.json({ message: "Clash Items Updated successfully" });
    }

    return res
      .status(422)
      .json({ errors: ["please select at least 2 images for clashing"] });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router; // Export the router to be used in other files
