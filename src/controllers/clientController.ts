import { Request, Response } from "express";
import { pool } from "../database/connection";

export const getAllClients = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query =
      "SELECT client_id as id, contact_numbers, contract_number, court_name, criminal_case_number, defendant_name as name, hearing_date, investigation_file_number, judge_name, lawyer_name, observations, prospect_id, signer_name, status FROM CLIENTS ORDER BY client_id";
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
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
export const getClientById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const client_id = parseInt(req.params.id);
  try {
    const query = {
      name: "get-client-id",
      text: "SELECT client_id as id, contact_numbers, contract_number, court_name, criminal_case_number, defendant_name as name, hearing_date, investigation_file_number, judge_name, lawyer_name, observations, prospect_id, signer_name, status FROM CLIENTS WHERE client_id = $1",
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
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
export const createClient = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    contract_number,
    defendant_name,
    criminal_case_number,
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
    const optionalData = observations ? observations : "";
    const numbers = JSON.stringify(contact_numbers);

    const prospect = await pool.query(
      "SELECT status FROM PROSPECTS WHERE operation_id = $1",
      [prospect_id]
    );

    if (prospect.rows[0].status !== "Aprobado") {
      return res.status(400).json({
        success: false,
        message: "No es posible agregar un cliente sin antes ser aprobado.",
      });
    }
    const query = {
      text: "INSERT INTO CLIENTS(contract_number, defendant_name, criminal_case_number, investigation_file_number, judge_name, court_name, lawyer_name, signer_name, contact_numbers, hearing_date, observations, status, prospect_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
      values: [
        contract_number,
        defendant_name,
        criminal_case_number,
        investigation_file_number,
        judge_name,
        court_name,
        lawyer_name,
        signer_name,
        numbers,
        hearing_date,
        optionalData,
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
    if (error?.code === "22007")
      return res.status(400).json({
        success: false,
        message: "Verifique que la fecha sea correcta",
      });
    if (error?.code === "23505" && error.constraint.includes("contract_number"))
      return res.status(400).json({
        success: false,
        message: `Ya existe  el contrato #${contract_number} registrado en base de datos`,
      });
    if (error?.code === "23505" && error.constraint.includes("defendant_name"))
      return res.status(400).json({
        success: false,
        message: `Ya existe un imputado con el nombre de ${defendant_name} registrado en base de datos`,
      });
    if (error?.code === "23505" && error.constraint.includes("prospect_id"))
      return res.status(400).json({
        success: false,
        message: `Al parecer el prospecto que intenta agregar ya ha sido registrado como cliente.`,
      });
    if (error?.code === "23503" && error.constraint.includes("prospect_id"))
      return res.status(400).json({
        success: false,
        message: `El prospecto con el id #${prospect_id} no existe en base de datos, por lo que no es posible registrarlo como cliente.`,
      });
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
export const updateClient = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const client_id = parseInt(req.params.id);
  const {
    contract_number,
    defendant_name,
    criminal_case_number,
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
    const optionalData = observations ? observations : "";
    const numbers = JSON.stringify(contact_numbers);
    const query = {
      text: "UPDATE CLIENTS SET criminal_case_number=$1, investigation_file_number=$2, judge_name=$3, court_name=$4, lawyer_name=$5, signer_name=$6, contact_numbers=$7, hearing_date=$8, observations=$9, status=$10 WHERE client_id = $11",
      values: [
        criminal_case_number,
        investigation_file_number,
        judge_name,
        court_name,
        lawyer_name,
        signer_name,
        numbers,
        hearing_date,
        optionalData,
        status,
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
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
export const deleteClient = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
    if (error?.code === "23503" && error.constraint.includes("client_id"))
      return res.status(400).json({
        success: false,
        message:
          "No es posible eliminar a este cliente debido a que es un portador.",
      });
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};

export const getApprovedClientsWithoutCarrier = async (
  req: Request,
  res: Response
) => {
  try {
    const query = {
      text: "SELECT client_id as id, defendant_name as name FROM CLIENTS WHERE status = 'Pendiente de colocación' OR status = 'Colocado' AND client_id NOT IN (SELECT client_id FROM CARRIERS)",
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
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
