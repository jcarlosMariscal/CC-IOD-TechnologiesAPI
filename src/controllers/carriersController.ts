import { Request, Response } from "express";
import { pool } from "../database/connection";

export const getAllCarriers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query = "SELECT * FROM CARRIERS";
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún portador." });
    return res.status(201).json({
      success: true,
      message: "Información de todos los portadores",
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
