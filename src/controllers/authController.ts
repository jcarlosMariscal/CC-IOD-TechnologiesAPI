import { NextFunction, Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import { pool } from "../database/connection";
import { generateToken } from "../services/auth.service";
import { IUser } from "../models/user.interface";

const validateUser = async (): Promise<boolean> => {
  const query = "SELECT 1 FROM USERS WHERE role_id = 1 LIMIT 1";
  try {
    const res = await pool.query(query);
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error("Error al validar usuario:", error);
    throw error;
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name, email, password }: IUser = req.body;
  try {
    const isAdmin = await validateUser();
    if (isAdmin)
      return res.status(500).json({ message: "Administrador ya registrado." });
    const role = 1;
    const hashedPassword = await hashPassword(password);
    const query = {
      text: "INSERT INTO USERS(name, email,password, role_id) VALUES($1, $2, $3, $4) RETURNING user_id",
      values: [name, email, hashedPassword, role],
    };
    await pool.query(query);

    return res.status(201).json({
      success: true,
      data: { name, email },
      message: "El administrador se ha registrado correctamente",
    });
  } catch (error: any) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email, password }: IUser = req.body;
  try {
    const query = {
      name: "login-user",
      text: "SELECT user_id, name, email, password, role_id FROM USERS WHERE email = $1",
      values: [email],
    };
    const result = await pool.query(query);
    const user = result.rows[0];
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch)
      return res
        .status(401)
        .json({ message: "Correo y contraseña no coinciden." });
    const token = generateToken({ id: user.user_id, email: user.email });
    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   secure: true,
    //   // maxAge: 3600000, // 1 hour
    //   maxAge: 60,
    // });
    return res.status(201).json({
      success: true,
      data: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role_id === 1 ? "Administrador" : "Administrativo",
      },
      token,
      message: "El usuario ha iniciado sesión",
    });
  } catch (error) {
    next(error);
  }
};
// 91
