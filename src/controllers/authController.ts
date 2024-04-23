import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import { pool } from "../database/connection";
import { generateToken } from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;
  try {
    if (!name) return res.status(400).json({ error: "El nombre es obligatorio" });
    if (!email) return res.status(400).json({ error: "El correo es obligatorio" });
    if (!password) return res.status(400).json({ error: "La contraseña es obligatorio" });

    const hashedPassword = await hashPassword(password);
    const query = {
      text: 'INSERT INTO users(name, email,password) VALUES($1, $2, $3) RETURNING userId',
      values: [name, email, hashedPassword],
    }
    const result = await pool.query(query);
    const userId = result.rows[0].userId;
    const token = generateToken({ id: userId, email });
    
    return res.status(201).json({
      message: 'El usuario se ha creado correctamente',
      user: { name, email },
      token
    });
  } catch (error:any) {
    if (error?.code === "23505") return res.status(400).json(
      { message: "El correo ingresado ya existe en la base de datos" }
    );
    return res.status(500).json({message: "Ha ocurrido un error en el servidor. Intente de nuevo más tarde" });
  }
}

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  try {
    if (!email) return res.status(400).json({ error: "El correo es obligatorio" });
    if (!password) return res.status(400).json({ error: "La contraseña es obligatorio" });
    const query = {
      name: 'login-user',
      text: 'SELECT userId, name, email, password FROM users WHERE email = $1',
      values: [email],
    }
    const result = await pool.query(query)
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Usuario y contraseña no coinciden." });
    const token = generateToken({ id: user.userId, email: user.email });
    return res.status(201).json({
      message: 'El usuario ha iniciado sesión',
      user: { name:user.name, email:user.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({message: "Ha ocurrido un error en el servidor. Intente más tarde" });
  }
}