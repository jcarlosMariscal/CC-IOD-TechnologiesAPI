import { Request, Response } from "express";
import { pool } from "../database/connection";
import { hashPassword } from "../services/password.service";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query =
      "SELECT user_id as id, A.name, email, A.role_id, B.name as role_name FROM USERS A INNER JOIN ROLES B ON A.role_id = B.role_id ORDER BY user_id";
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún usuario." });
    return res.status(201).json({
      success: true,
      message: "Información de todos los usuarios",
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

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user_id = parseInt(req.params.id);
  try {
    const query = {
      name: "get-prospect-id",
      text: "SELECT user_id as id, A.name, email, password, A.role_id, B.name as role_name FROM USERS A INNER JOIN ROLES B ON A.role_id = B.role_id WHERE user_id = $1",
      values: [user_id],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún usuario." });
    return res.status(201).json({
      success: true,
      message: "Datos del usuario obtenidos",
      data: result.rows[0],
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

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, password } = req.body;
  try {
    const role_id = 2; // Administrativo
    const hashedPassword = await hashPassword(password);
    const query = {
      text: "INSERT INTO USERS(name, email, password, role_id) VALUES($1, $2, $3, $4)",
      values: [name, email, hashedPassword, role_id],
    };
    await pool.query(query);
    return res.status(201).json({
      success: true,
      message: "El usuario se ha creado correctamente",
      data: { name, email },
    });
  } catch (error: any) {
    if (error.code === "23505" && error.constraint.includes("email")) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con este correo registrado.",
      });
    }
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user_id = parseInt(req.params.id);
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const query = {
      text: "UPDATE USERS SET name=$1, email=$2, password=$3 WHERE user_id = $4",
      values: [name, email, hashedPassword, user_id],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún usuario." });
    return res.status(201).json({
      success: true,
      message: "El usuario se ha modificado correctamente",
      data: { name, email },
    });
  } catch (error: any) {
    if (error.code === "23505" && error.constraint.includes("email")) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con este correo registrado.",
      });
    }
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.id);
  try {
    const role_admin = 1;
    const query = {
      text: "DELETE FROM USERS WHERE user_id = $1 AND role_id != $2",
      values: [user_id, role_admin],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res.status(404).json({
        message:
          "No se pudo eliminar el usuario. Esto puede deberse a que no existe o es un administrador.",
      });
    return res.status(201).json({
      success: true,
      message: `El usuario ${user_id} ha sido eliminado`,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
