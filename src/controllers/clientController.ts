import { NextFunction, Request, Response } from "express";
import { pool } from "../database/connection";

export const getAllClients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const query =
      "SELECT client_id as id, contact_numbers, contract_number, court_name, criminal_case, defendant_name as name, hearing_date, investigation_file_number, judge_name, lawyer_name, observations, prospect_id, signer_name, status FROM CLIENTS ORDER BY client_id";
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún cliente." });
    return res.status(201).json({
      success: true,
      message: "Información de todos los clientes",
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};
export const getClientById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const client_id = parseInt(req.params.id);
  try {
    const query = {
      name: "get-client-id",
      text: "SELECT client_id as id, contact_numbers, contract_number, court_name, criminal_case, defendant_name as name, hearing_date, investigation_file_number, judge_name, lawyer_name, observations, prospect_id, signer_name, status FROM CLIENTS WHERE client_id = $1",
      values: [client_id],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún cliente." });
    return res.status(201).json({
      success: true,
      message: "Datos del cliente obtenidos",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const {
    contract_number,
    defendant_name,
    criminal_case,
    investigation_file_number,
    judge_name,
    court_name,
    lawyer_name,
    signer_name,
    contact_numbers,
    hearing_date,
    observations,
    status,
    prospect_id,
  } = req.body;
  try {
    const obserOptional = observations ? observations : "";
    const invFileOptional = investigation_file_number
      ? investigation_file_number
      : null;
    const numbers = JSON.stringify(contact_numbers);

    const prospect = await pool.query(
      "SELECT status FROM PROSPECTS WHERE prospect_id = $1",
      [prospect_id]
    );

    if (prospect.rows[0].status !== "Aprobado") {
      return res.status(400).json({
        success: false,
        message: "No es posible agregar un cliente sin antes ser aprobado.",
      });
    }
    const query = {
      text: "INSERT INTO CLIENTS(contract_number, defendant_name, criminal_case, investigation_file_number, judge_name, court_name, lawyer_name, signer_name, contact_numbers, hearing_date, observations, status, prospect_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
      values: [
        contract_number,
        defendant_name,
        criminal_case,
        invFileOptional,
        judge_name,
        court_name,
        lawyer_name,
        signer_name,
        numbers,
        hearing_date,
        obserOptional,
        status,
        prospect_id,
      ],
    };
    await pool.query(query);
    return res.status(201).json({
      success: true,
      message: "El prospecto se ha creado correctamente",
      data: req.body,
    });
  } catch (error: any) {
    next(error);
  }
};
export const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const client_id = parseInt(req.params.id);
  const {
    contract_number,
    defendant_name,
    criminal_case,
    investigation_file_number,
    judge_name,
    court_name,
    lawyer_name,
    signer_name,
    contact_numbers,
    hearing_date,
    observations,
    status,
    prospect_id,
  } = req.body;
  try {
    const client = await pool.query(
      "SELECT client_id FROM CARRIERS WHERE client_id = $1",
      [client_id]
    );
    const newStatus = client.rowCount
      ? status === "Pendiente de colocación" || status === "Colocado"
        ? status
        : "Pendiente de colocación"
      : status;
    const obserOptional = observations ? observations : "";
    const invFileOptional = investigation_file_number
      ? investigation_file_number
      : null;
    const numbers = JSON.stringify(contact_numbers);
    const query = {
      text: "UPDATE CLIENTS SET criminal_case=$1, investigation_file_number=$2, judge_name=$3, court_name=$4, lawyer_name=$5, signer_name=$6, contact_numbers=$7, hearing_date=$8, observations=$9, status=$10 WHERE client_id = $11",
      values: [
        criminal_case,
        invFileOptional,
        judge_name,
        court_name,
        lawyer_name,
        signer_name,
        numbers,
        hearing_date,
        obserOptional,
        newStatus,
        client_id,
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
      data: { defendant_name },
    });
  } catch (error) {
    next(error);
  }
};
export const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const clientId = parseInt(req.params.id);
  try {
    const query = {
      text: "DELETE FROM CLIENTS WHERE client_id = $1",
      values: [clientId],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "El cliente que desea eliminar no se encuentra." });
    return res.status(201).json({
      success: true,
      message: `El cliente ${clientId} ha sido eliminado`,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getApprovedClientsWithoutCarrier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const query = {
      text: "SELECT client_id as id, defendant_name as name FROM CLIENTS WHERE (status = 'Pendiente de colocación' OR status = 'Colocado')  AND client_id NOT IN (SELECT client_id FROM CARRIERS)",
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res.status(404).json({
        message: "No se encontró ningún cliente que pueda ser portador",
      });
    return res.status(201).json({
      success: true,
      message: "Prospectos con estado Pendiente de colocación o Colocado",
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};
// 281
