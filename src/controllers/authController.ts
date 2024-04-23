import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import { pool } from "../database/connection";
import { generateToken } from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;
  try {
    if (!name) return res.status(400).json({ error: "El name es obligatorio" });
    if (!email) return res.status(400).json({ error: "El email es obligatorio" });
    if (!password) return res.status(400).json({ error: "El password es obligatorio" });

    const hashedPassword = await hashPassword(password);
    const query = {
      text: 'INSERT INTO users(name, email,password) VALUES($1, $2, $3) RETURNING userId',
      values: [name, email, hashedPassword],
    }
    const result = await pool.query(query);
    const userId = result.rows[0].userId;
    const token = generateToken({ id: userId, email });
    
    return res.status(201).json({
      message: 'Task created successfully',
      task: { name, email },
      token
    });
  } catch (error) {
    return res.status(500).json({ error: "Ha ocurrido un error en el servidor. Intente más tarde" });
  }
}