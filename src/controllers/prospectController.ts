import { Request, Response } from "express";
import { pool } from "../database/connection";

export const createProspect = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, phone, relationshipId, stateId, date, observations } = req.body;
  try {
    if (!name) return res.status(400).json({ error: "El nombre es obligatorio" });
    if (!email) return res.status(400).json({ error: "El correo es obligatorio" });
    if (!phone) return res.status(400).json({ error: "El teléfono es obligatorio" });
    if (!relationshipId) return res.status(400).json({error: "El paréntesco es obligatorio" });
    if (!stateId) return res.status(400).json({ error: "El estado es obligatorio" });
    if (!date) return res.status(400).json({ error: "La fecha es obligatorio" });
    const optionalData = observations ? observations : ""

    const query = {
      text: 'INSERT INTO prospects(name, email, phone, date, relationshipId, stateId, observations) VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [name, email, phone, date, relationshipId, stateId, optionalData],
    }
    await pool.query(query);
    return res.status(201).json({
      message: 'El prospecto se ha creado correctamente',
      prospect: { name, email }
    });
  } catch (error) {
    return res.status(500).json(
      { message: "Ha ocurrido un error en el servidor. Intente de nuevo más tarde", error }
    );
  }
}