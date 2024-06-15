import path from "path";
import fs from "fs";
import { Request } from "express";

export const generateFilename = (req: Request, filename: string) => {
  const baseUrl = req.protocol + "://" + req.get("host");
  return `${baseUrl}/uploads/${filename}`;
};

export const extractFilename = (url: string) => {
  const urlObject = new URL(url);
  return path.basename(urlObject.pathname);
};

export const removeFile = (file: string): boolean => {
  try {
    const filename = extractFilename(file);
    fs.unlinkSync(path.join("uploads", filename)); // Elimina el archivo antiguo.
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const lowercase = (text: string) => text.toLowerCase();
