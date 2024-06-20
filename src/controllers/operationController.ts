import { NextFunction, Request, Response } from "express";
import { pool } from "../database/connection";

import { azureDeleteBlob, azureUploadBlob } from "../services/azure.service";
import { getBlobName } from "../helpers/helpers";

export const getAllOperations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const query =
      "SELECT operation_id as id, C.defendant_name as name, C.contract, installation_report FROM OPERATIONS A INNER JOIN CARRIERS B ON A.carrier_id = B.carrier_id INNER JOIN CLIENTS C ON B.client_id = C.client_id ORDER BY operation_id";
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningúna operación." });
    return res.status(201).json({
      success: true,
      message: "Información de todas las operaciones",
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const operation_id = parseInt(req.params.id);
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Parece que no hay ningún cambio que hacer.",
      });
    }
    const file = req.file;

    const { message, success } = await azureUploadBlob({
      blob: file,
      containerName: "reports",
    });
    if (!success)
      return res.status(500).json({
        success: false,
        message: message,
      });
    const report = message;
    const query = {
      text: "UPDATE OPERATIONS SET installation_report = $1 WHERE operation_id = $2 RETURNING installation_report",
      values: [report, operation_id],
    };
    await pool.query(query);
    return res.status(201).json({
      success: true,
      message: "La operación se ha modificado correctamente",
      data: { installation_report: report },
    });
  } catch (error: any) {
    next(error);
  }
};
export const deleteOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const carrier_id = parseInt(req.params.id);
  try {
    const query = {
      text: "DELETE FROM OPERATIONS WHERE carrier_id = $1 RETURNING installation_report",
      values: [carrier_id],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "La operación que desea eliminar no se encuentra." });
    const report = getBlobName(result.rows[0].installation_report as string);
    const { message, success } = await azureDeleteBlob({
      blobname: report,
      containerName: "reports",
    });
    if (!success)
      return res.status(500).json({
        success: false,
        message: message,
      });
    return res.status(201).json({
      success: true,
      message: `La operación ha sido eliminado`,
    });
  } catch (error: any) {
    next(error);
  }
};
export const deleteFile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const operation_id = parseInt(req.params.id);
  const { filename } = req.body;
  try {
    const { message, success } = await azureDeleteBlob({
      blobname: filename,
      containerName: "reports",
    });
    if (!success)
      return res.status(500).json({
        success: false,
        message: message,
      });
    const query = {
      text: "UPDATE OPERATIONS SET installation_report = $1 WHERE operation_id = $2",
      values: [null, operation_id],
    };
    await pool.query(query);
    return res.status(201).json({
      success: true,
      message: "La operación se ha modificado correctamente",
    });
  } catch (error: any) {
    next(error);
  }
};
