import { Request } from "express";

// Generar el nombre de la columna para la base de datos
export const generateFilename = (req: Request, filename: string) => {
  const baseUrl = req.protocol + "://" + req.get("host");
  return `${baseUrl}/uploads/${filename}`;
};
