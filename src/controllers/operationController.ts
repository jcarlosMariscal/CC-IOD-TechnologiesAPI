import { Request, Response } from "express";
import { pool } from "../database/connection";
import { removeFile } from "../helpers/removeFile";
import { generateFilename } from "../helpers/generateFilename";

export const getAllOperations = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query =
      "SELECT operation_id as id, C.defendant_name as name, contract, installation_report FROM OPERATIONS A INNER JOIN CARRIERS B ON A.carrier_id = B.carrier_id INNER JOIN CLIENTS C ON B.client_id = C.client_id ORDER BY operation_id";
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
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
export const getOperationById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const operation_id = parseInt(req.params.id);
  try {
    const query = {
      name: "get-prospect-id",
      text: "SELECT operation_id, contract, installation_report, carrier_id FROM OPERATIONS WHERE operation_id = $1",
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
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};

export const updateOperation = async (req: Request, res: Response) => {
  const operation_id = parseInt(req.params.id);
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files.contract && !files.installation_report) {
      return res.status(400).json({
        success: false,
        message: "Parece que no hay ningún cambio que hacer.",
      });
    }
    const operation = await pool.query(
      "SELECT contract, installation_report FROM OPERATIONS WHERE operation_id = $1",
      [operation_id]
    );
    if (files.contract && operation.rows[0].contract) {
      const remove = removeFile(operation.rows[0].contract);
      if (!remove) {
        return res.status(400).json({
          message: "No se pudo eliminar el contrato anterior.",
        });
      }
    }
    if (files.installation_report && operation.rows[0].installation_report) {
      const remove = removeFile(operation.rows[0].installation_report);
      if (!remove) {
        return res.status(400).json({
          message: "No se pudo eliminar el reporte de instalación anterior.",
        });
      }
    }

    const contract = files.contract
      ? generateFilename(req, files.contract[0].filename)
      : operation.rows[0].contract;

    const installation_report = files.installation_report
      ? generateFilename(req, files.installation_report[0].filename)
      : operation.rows[0].installation_report;

    const query = {
      text: "UPDATE OPERATIONS SET contract = $1, installation_report = $2 WHERE operation_id = $3",
      values: [contract, installation_report, operation_id],
    };
    await pool.query(query);
    return res.status(201).json({
      success: true,
      message: "La operación se ha modificado correctamente",
    });
  } catch (error: any) {
    return res.status(500).json({
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde.sdsd",
      error,
    });
  }
};

export const deleteOperation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const operation_id = parseInt(req.params.id);
  try {
    const query = {
      text: "DELETE FROM OPERATIONS WHERE operation_id = $1",
      values: [operation_id],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "La operación que desea eliminar no se encuentra." });
    return res.status(201).json({
      success: true,
      message: `La operación ${operation_id} ha sido eliminado`,
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
