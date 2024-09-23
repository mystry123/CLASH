import { ZodError } from "zod";
import path from "path";
import ejs from "ejs";
import moment from "moment";
import { supportMimes } from "./config/fileSystem";
import { UploadedFile } from "express-fileupload";
import { v4 as uuid4 } from "uuid";
import fs from "fs";

export const formatZodError = (error: ZodError) => {
  const errors: any = {};
  error.errors.map((err) => {
    const key = err.path.join(".");
    errors[key] = err.message;
  });

  return errors;
};

export const renderEjs = async (filename: string, payload: any) => {
  const html = await ejs.renderFile(
    path.join(__dirname, "views", "emails", filename),
    payload
  );
  return html;
};

export const checkTimeDiff = (date: Date | string): number => {
  const now = moment();
  const then = moment(date);
  return moment.duration(now.diff(then)).asHours();
};

export const imageValidator = (size: number, mime: string): string | null => {
  if (bytesToMB(size) > 2) {
    return "File size should be less than 2 MB";
  } else if (!supportMimes.includes(mime)) {
    return `File type should be ${supportMimes.join(", ")}`;
  }
  return null;
};

export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

export const uploadFile = async (image: UploadedFile): Promise<string> => {
  const imageExt = image.name.split(".").pop();
  const imageName = `${uuid4()}.${imageExt}`;
  const uploadedPath = process.cwd() + "/public/uploads/" + imageName;
  image.mv(uploadedPath, (err) => {
    if (err) {
      console.error(err);
      throw new Error("File upload failed");
    }
  });

  return imageName;
};

export const deleteFile = async (filename: string) => {
  const filePath = process.cwd() + "/public/uploads/" + filename;

  if (fs.existsSync(filePath)) {
     fs.unlinkSync(filePath);
  }
};
