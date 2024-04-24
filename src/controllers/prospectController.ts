import { Request, Response } from "express";
import { pool } from "../database/connection";

export const createProspect = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, phone, relationshipId, statusId, date, observations } = req.body;
  try {
    const optionalData = observations ? observations : ""

    const query = {
      text: 'INSERT INTO prospects(name, email, phone, date, relationshipId, statusId, observations) VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [name, email, phone, date, relationshipId, statusId, optionalData],
    }
    await pool.query(query);
    return res.status(201).json({
      message: 'El prospecto se ha creado correctamente',
      prospect: { name, email }
    });
  } catch (error:any) {
    if (error?.code === "22007") return res.status(400).json({ message: "Verifique que la fecha sea correcta" });
    if (error?.code === "23503" && error.constraint.includes("relationshipid")) return res.status(400).json(
      { message: "Parece que no existe el parentesco seleccionado. Seleccione una correcta" }
    );
    if (error?.code === "23503" && error.constraint.includes("status")) return res.status(400).json(
      { message: "Parece que no existe el estado seleccionado. Seleccione una correcta" }
    );
    return res.status(500).json(
      { message: "Ha ocurrido un error en el servidor. Intente de nuevo más tarde", error }
    );
  }
}