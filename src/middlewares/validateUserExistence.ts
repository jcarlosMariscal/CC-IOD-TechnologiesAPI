import { Request, Response, NextFunction } from "express";
import { pool } from "../database/connection";

export const validateUserExistence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Para esta acción es necesario el ID del portador.",
        files: req.files,
      });
    }
    const operation = await pool.query(
      "SELECT * FROM OPERATIONS WHERE operation_id = $1",
      [id]
    );
    if (!operation.rowCount) {
      return res.status(500).json({
        success: false,
        message: "No hay ninguna operación con el ID especificado",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al validar la existencia del portador.",
      error,
    });
  }
};
