import { Request, Response, NextFunction } from "express";
import { pool } from "../database/connection";

export const validateUserExistence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const method = req.method;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Para esta acción es necesario el ID del portador.",
        files: req.files,
      });
    }
    if (method === "POST") {
      const carrierExists = await pool.query(
        "SELECT * FROM CARRIERS WHERE carrier_id = $1",
        [id]
      );
      if (carrierExists.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "No es posible crear una operación para este portador por que no existe.",
        });
      }
    }
    if (method === "PUT") {
      const operation = await pool.query(
        "SELECT * FROM OPERATIONS WHERE operation_id = $1",
        [id]
      );
      if (!operation.rowCount) {
        return res.status(500).json({
          message: "No hay ninguna operación con el ID especificado",
        });
      }
    }
    const operationExists = await pool.query(
      "SELECT * FROM OPERATIONS WHERE carrier_id = $1",
      [id]
    );
    if (operationExists.rows.length) {
      return res.status(400).json({
        success: false,
        message:
          "No es posible crear una operación para este portador por que ya tiene una registrada.",
      });
    }

    next();
  } catch (error) {
    console.error("Error al validar la existencia del portador:", error);
    res.status(500).send("Error al validar la existencia del portador.");
  }
};
