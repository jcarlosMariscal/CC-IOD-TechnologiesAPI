import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import { pool } from "../database/connection";
import { generateToken } from "../services/auth.service";
import { IUser } from "../models/user.interface";

const validateUser = async (): Promise<boolean> => {
  const query = 'SELECT 1 FROM users WHERE role_id = 1 LIMIT 1';
  try {
    const res = await pool.query(query);
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error al validar usuario:', error);
    throw error;
  }
}

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } : IUser = req.body;
  try {
    const isAdmin = await validateUser();
    if (isAdmin) return res.status(500).json({ message: "Administrador ya registrado." });
    const role = 1;
    const hashedPassword = await hashPassword(password);
    const query = {
      text: 'INSERT INTO users(name, email,password, role_id) VALUES($1, $2, $3, $4) RETURNING user_id',
      values: [name, email, hashedPassword, role],
    }
    const result = await pool.query(query);
    const user_id = result.rows[0].user_id;
    const token = generateToken({ id: user_id, email });
    
    return res.status(201).json({
      message: 'El administrador se ha registrado correctamente',
      user: { name, email },
      token
    });
  } catch (error:any) {
    return res.status(500).json({message: "Ha ocurrido un error en el servidor. Intente de nuevo más tarde" });
  }
}

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password }:IUser = req.body;
  try {
    const query = {
      name: 'login-user',
      text: 'SELECT user_id, name, email, password, role_id FROM users WHERE email = $1',
      values: [email],
    }
    const result = await pool.query(query)
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Correo y contraseña no coinciden." });
    const token = generateToken({ id: user.user_id, email: user.email });
    return res.status(201).json({
      message: 'El usuario ha iniciado sesión',
      user: { name:user.name, email:user.email, role:user.role_id },
      token,
    });
  } catch (error) {
    return res.status(500).json({message: "Ha ocurrido un error en el servidor. Intente más tarde" });
  }
}