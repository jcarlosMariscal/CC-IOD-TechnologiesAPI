import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const validationFiles = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    let message =
      err.code === "LIMIT_FILE_SIZE"
        ? "El archivo es muy grande. El tamaño máximo permitido es de 5MB."
        : err.code === "LIMIT_UNEXPECTED_FILE"
        ? "Para esta funcionalidad solo se admiten archivos PDF."
        : "Ha ocurrido un error al subir los archivos.";
    res.status(400).json({
      success: false,
      message,
    });
  } else if (err) {
    if (err.message.includes("mismo nombre")) {
      res.status(409).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message:
          "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
        err,
      });
    }
  } else {
    next();
  }
};
