import { Request, Response } from "express";
import { pool } from "../database/connection";

export const getAllProspects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query =
      "SELECT A.*, B.name as relationship_name FROM PROSPECTS A INNER JOIN RELATIONSHIPS B ON A.relationship_id = B.relationship_id";
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún prospecto." });
    return res.status(201).json({
      success: true,
      message: "Información de todos los prospectos",
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

export const getProspectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const prospect_id = parseInt(req.params.id);
  try {
    const query = {
      name: "get-prospect-id",
      text: "SELECT A.*, B.name as relationship_name FROM PROSPECTS A INNER JOIN RELATIONSHIPS B ON A.relationship_id = B.relationship_id WHERE prospect_id = $1",
      values: [prospect_id],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún prospecto." });
    return res.status(201).json({
      success: true,
      message: "Datos del prospecto obtenidos",
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

export const createProspect = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, phone, relationship_id, status, date, observations } =
    req.body;
  try {
    const optionalData = observations ? observations : "";

    const query = {
      text: "INSERT INTO PROSPECTS(name, email, phone, date, relationship_id, status, observations) VALUES($1, $2, $3, $4, $5, $6, $7)",
      values: [name, email, phone, date, relationship_id, status, optionalData],
    };
    await pool.query(query);
    return res.status(201).json({
      success: true,
      message: "El prospecto se ha creado correctamente",
      data: { name, email },
    });
  } catch (error: any) {
    if (error?.code === "22007")
      return res.status(400).json({
        success: false,
        message: "Verifique que la fecha sea correcta",
      });
    if (error?.code === "23503" && error.constraint.includes("relationship_id"))
      return res.status(400).json({
        success: false,
        message:
          "Parece que no existe el parentesco seleccionado. Seleccione una correcta",
      });
    if (error?.code === "23503" && error.constraint.includes("status"))
      return res.status(400).json({
        success: false,
        message:
          "Parece que no existe el estado seleccionado. Seleccione una correcta",
      });
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
export const updateProspect = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const prospect_id = parseInt(req.params.id);
  const { name, email, phone, relationship_id, status, date, observations } =
    req.body;
  try {
    const optionalData = observations ? observations : "";
    const query = {
      text: "UPDATE PROSPECTS SET name=$1, email=$2, phone=$3, date=$4, relationship_id=$5, status=$6, observations=$7 WHERE prospect_id = $8",
      values: [
        name,
        email,
        phone,
        date,
        relationship_id,
        status,
        optionalData,
        prospect_id,
      ],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún prospecto." });
    return res.status(201).json({
      success: true,
      message: "El prospecto se ha modificado correctamente",
      data: { name, email },
    });
  } catch (error: any) {
    if (error?.code === "23503" && error.constraint.includes("relationship_id"))
      return res.status(400).json({
        success: false,
        message:
          "Parece que no existe el parentesco seleccionado. Seleccione una correcta",
      });
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
export const deleteProspect = async (req: Request, res: Response) => {
  const prospect_id = parseInt(req.params.id);
  try {
    const query = {
      text: "DELETE FROM PROSPECTS WHERE prospect_id = $1",
      values: [prospect_id],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "El prospecto que desea eliminar no se encuentra." });
    return res.status(201).json({
      success: true,
      message: `El prospecto ${prospect_id} ha sido eliminado`,
    });
  } catch (error: any) {
    if (error?.code === "23503" && error.constraint.includes("prospect_id"))
      return res.status(400).json({
        success: false,
        message:
          "No es posible eliminar a este prospecto debido a que es un cliente.",
      });
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
