import path from "path";
import fs from "fs";
import { extractFilename } from "./extractFilename";

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
