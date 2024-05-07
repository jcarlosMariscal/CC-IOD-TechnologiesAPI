import { Request, Response } from "express";
import { pool } from "../database/connection";

export const getAllClients = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query = "SELECT * FROM clients";
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
  const clientId = parseInt(req.params.id);
  try {
    const query = {
      name: "get-client-id",
      text: "SELECT * FROM clients WHERE client_id = $1",
      values: [clientId],
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
    contractNumber,
    defendantName,
    criminalCaseNumber,
    investigationFileNumber,
    judgeName,
    courtName,
    lawyerName,
    signerName,
    contactNumbers,
    hearingDate,
    observations,
    status,
    prospectId,
  } = req.body;
  try {
    const optionalData = observations ? observations : "";
    const numbers = JSON.stringify(contactNumbers);

    const query = {
      text: "INSERT INTO clients(contractNumber, defendantName, criminalCaseNumber, investigationFileNumber, judgeName, courtName, lawyerName, signerName, contactNumbers, hearingDate, observations, status, prospect_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
      values: [
        contractNumber,
        defendantName,
        criminalCaseNumber,
        investigationFileNumber,
        judgeName,
        courtName,
        lawyerName,
        signerName,
        numbers,
        hearingDate,
        optionalData,
        status,
        prospectId,
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
    if (error?.code === "23505" && error.constraint.includes("contractnumber"))
      return res.status(400).json({
        success: false,
        message: `Ya existe  el contrato #${contractNumber} registrado en base de datos`,
      });
    if (error?.code === "23505" && error.constraint.includes("defendantname"))
      return res.status(400).json({
        success: false,
        message: `Ya existe un imputado con el nombre de ${defendantName} registrado en base de datos`,
      });
    if (error?.code === "23505" && error.constraint.includes("prospect_id"))
      return res.status(400).json({
        success: false,
        message: `Al parecer el prospecto que intenta agregar ya ha sido registrado como cliente.`,
      });
    if (error?.code === "23503" && error.constraint.includes("prospect_id"))
      return res.status(400).json({
        success: false,
        message: `El prospecto con el id #${prospectId} no existe en base de datos, por lo que no es posible registrarlo como cliente.`,
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
  const clientId = parseInt(req.params.id);
  const {
    contractNumber,
    defendantName,
    criminalCaseNumber,
    investigationFileNumber,
    judgeName,
    courtName,
    lawyerName,
    signerName,
    contactNumbers,
    hearingDate,
    observations,
    status,
    prospectId,
  } = req.body;
  try {
    const optionalData = observations ? observations : "";
    const query = {
      text: "UPDATE clients SET criminalCaseNumber=$1, investigationFileNumber=$2, judgeName=$3, courtName=$4, lawyerName=$5, signerName=$6, contactNumbers=$7, hearingDate=$8, observations=$9, status=$10 WHERE client_id = $11",
      values: [
        criminalCaseNumber,
        investigationFileNumber,
        judgeName,
        courtName,
        lawyerName,
        signerName,
        contactNumbers,
        hearingDate,
        optionalData,
        status,
        clientId,
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
      data: { defendantName },
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
      text: "DELETE FROM clients WHERE client_id = $1",
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
