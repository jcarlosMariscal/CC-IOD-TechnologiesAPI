import { NextFunction, Request, Response } from "express";
import { pool } from "../database/connection";
import { removeFile } from "../helpers/removeFile";
import { generateFilename } from "../helpers/generateFilename";

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
export const getOperationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const operation_id = parseInt(req.params.id);
  try {
    const query = {
      name: "get-prospect-id",
      text: "SELECT operation_id as id, contract, installation_report, carrier_id FROM OPERATIONS WHERE operation_id = $1",
      values: [operation_id],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningúna operación." });
    return res.status(201).json({
      success: true,
      message: "Información de la operación.",
      data: result.rows[0],
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
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files.installation_report) {
      return res.status(400).json({
        success: false,
        message: "Parece que no hay ningún cambio que hacer.",
      });
    }
    const operation = await pool.query(
      "SELECT installation_report FROM OPERATIONS WHERE operation_id = $1",
      [operation_id]
    );
    if (files.installation_report && operation.rows[0].installation_report) {
      const remove = removeFile(operation.rows[0].installation_report);
      if (!remove) {
        return res.status(400).json({
          message: "No se pudo eliminar el reporte de instalación anterior.",
        });
      }
    }
    const installation_report = files.installation_report
      ? generateFilename(req, files.installation_report[0].filename)
      : operation.rows[0].installation_report;

    const query = {
      text: "UPDATE OPERATIONS SET installation_report = $1 WHERE operation_id = $2 RETURNING installation_report",
      values: [installation_report, operation_id],
    };
    const result = await pool.query(query);
    return res.status(201).json({
      success: true,
      message: "La operación se ha modificado correctamente",
      data: { installation_report: result.rows[0].installation_report },
    });
  } catch (error: any) {
    next(error);
  }
};
const removeFileOperation = async (carrier_id: number): Promise<boolean> => {
  const operation = await pool.query(
    "SELECT installation_report FROM OPERATIONS WHERE carrier_id = $1",
    [carrier_id]
  );
  const reportBD = operation.rowCount
    ? operation.rows[0].installation_report
    : null;
  if (!reportBD) return true;
  const remove = removeFile(reportBD);
  if (!remove) return false;
  return true;
};
export const deleteOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const carrier_id = parseInt(req.params.id);
  try {
    const remove = removeFileOperation(carrier_id);
    if (!remove)
      return res.status(400).json({
        success: false,
        message:
          "Ha ocurrido un error al intentar eliminar el reporte de instalación.",
      });
    const query = {
      text: "DELETE FROM OPERATIONS WHERE carrier_id = $1",
      values: [carrier_id],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "La operación que desea eliminar no se encuentra." });
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
  try {
    const remove = removeFileOperation(operation_id);
    if (!remove)
      return res.status(400).json({
        success: false,
        message:
          "Ha ocurrido un error al intentar eliminar el reporte de instalación.",
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
