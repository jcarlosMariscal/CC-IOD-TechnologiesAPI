import { NextFunction, Request, Response } from "express";
import { pool } from "../database/connection";
import { lowercase } from "../helpers/helpers";

export const getAllProspects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const query =
      "SELECT prospect_id as id, A.name, email, phone, date, observations, status, A.relationship_id, B.name as relationship_name FROM PROSPECTS A INNER JOIN RELATIONSHIPS B ON A.relationship_id = B.relationship_id ORDER BY prospect_id";
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
    next(error);
  }
};

export const createProspect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name, email, phone, relationship_id, status, date, observations } =
    req.body;
  try {
    const optionalData = observations ? observations : "";
    const lowerEmail = lowercase(email);

    const query = {
      text: "WITH inserted AS (INSERT INTO PROSPECTS(name, email, phone, date, relationship_id, status, observations) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *) SELECT prospect_id as id, A.name, email, phone, date, observations, status, A.relationship_id, B.name as relationship_name FROM inserted A INNER JOIN RELATIONSHIPS B ON A.relationship_id = B.relationship_id",
      values: [
        name,
        lowerEmail,
        phone,
        date,
        relationship_id,
        status,
        optionalData,
      ],
    };
    const result = await pool.query(query);
    return res.status(201).json({
      success: true,
      message: "El prospecto se ha creado correctamente",
      data: result.rows[0],
    });
  } catch (error: any) {
    next(error);
  }
};
export const updateProspect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const prospect_id = parseInt(req.params.id);
  const { name, email, phone, relationship_id, status, date, observations } =
    req.body;
  try {
    const lowerEmail = lowercase(email);
    const prospect = await pool.query(
      "SELECT prospect_id FROM CLIENTS WHERE prospect_id = $1",
      [prospect_id]
    );
    const newStatus = prospect.rowCount ? "Aprobado" : status;
    const optionalData = observations ? observations : "";
    const query = {
      text: "WITH updated AS (UPDATE PROSPECTS SET name=$1, email=$2, phone=$3, date=$4, relationship_id=$5, status=$6, observations=$7 WHERE prospect_id = $8 RETURNING *) SELECT prospect_id as id, A.name, email, phone, date, observations, status, A.relationship_id, B.name as relationship_name FROM updated A INNER JOIN RELATIONSHIPS B ON A.relationship_id = B.relationship_id",
      values: [
        name,
        lowerEmail,
        phone,
        date,
        relationship_id,
        newStatus,
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
      data: result.rows[0],
    });
  } catch (error: any) {
    next(error);
  }
};
export const deleteProspect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
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
    next(error);
  }
};

export const getApprovedProspectsWithoutClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const query = {
      // name: "get-prospect-id",
      text: "SELECT prospect_id as id, name FROM PROSPECTS WHERE status = 'Aprobado' AND prospect_id NOT IN (SELECT prospect_id FROM CLIENTS)",
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res.status(404).json({
        message: "No se encontró ningún prospecto que pueda ser cliente",
      });
    return res.status(201).json({
      success: true,
      message: "Datos del prospecto aprobados",
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};
