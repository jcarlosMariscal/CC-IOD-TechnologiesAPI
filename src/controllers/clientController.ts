import { Request, Response } from "express";
import { pool } from "../database/connection";

// export const getAllClients = async(req:Request, res:Response): Promise<Response> => {}
// export const getClientById = async(req:Request, res:Response): Promise<Response> => {}
export const createCLient = async (req: Request, res: Response): Promise<Response> => {
  const { contractNumber, defendantName, criminalCaseNumber, investigationFileNumber, judgeName, courtName, lawyerName, signerName, contactNumbers, hearingDate, observations, status, prospectId } = req.body;
  try {
    const optionalData = observations ? observations : "";
    const numbers = JSON.stringify(contactNumbers);

    const query = {
      text: 'INSERT INTO clients(contractNumber, defendantName, criminalCaseNumber, investigationFileNumber, judgeName, courtName, lawyerName, signerName, contactNumbers, hearingDate, observations, status, prospect_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      values: [contractNumber, defendantName, criminalCaseNumber, investigationFileNumber, judgeName, courtName, lawyerName, signerName, numbers, hearingDate, optionalData, status, prospectId],
    }
    await pool.query(query);
    return res.status(201).json({
      message: 'El prospecto se ha creado correctamente',
      data: req.body
    });
  } catch (error:any) {
    if (error?.code === "22007") return res.status(400).json({ message: "Verifique que la fecha sea correcta" });
    if (error?.code === "23505" && error.constraint.includes("contractnumber")) return res.status(400).json(
      { message: `Ya existe  el contrato #${contractNumber} registrado en base de datos` }
    );
    if (error?.code === "23505" && error.constraint.includes("defendantname")) return res.status(400).json(
      { message: `Ya existe un imputado con el nombre de ${defendantName} registrado en base de datos` }
    );
    if (error?.code === "23505" && error.constraint.includes("prospect_id")) return res.status(400).json(
      { message: `Al parecer el prospecto que intenta agregar ya ha sido registrado como cliente.` }
    );
    if (error?.code === "23503" && error.constraint.includes("prospect_id")) return res.status(400).json(
      { message: `El prospecto con el id #${prospectId} no existe en base de datos, por lo que no es posible registrarlo como cliente.` }
    );
    return res.status(500).json(
      { message: "Ha ocurrido un error en el servidor. Intente de nuevo más tarde", error }
    );
  }
}
// export const updateCLient = async(req:Request, res:Response): Promise<Response> => {}
// export const deleteCLient = async(req:Request, res:Response): Promise<Response> => {}