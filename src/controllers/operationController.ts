import { Request, Response } from "express";
import { pool } from "../database/connection";
import { removeFile } from "../helpers/removeFile";
import { generateFilename } from "../helpers/generateFilename";

export const getAllOperations = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query = "SELECT * FROM OPERATIONS";
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningúna operación." });
    return res.status(201).json({
      success: true,
      message: "Información de todas las operaciones",
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

export const createOperation = async (req: Request, res: Response) => {
  const { carrier_id } = req.body;
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const contract = files.contract
      ? generateFilename(req, files.contract[0].filename)
      : null;
    const report = files.installation_report
      ? generateFilename(req, files.installation_report[0].filename)
      : null;
    const query = {
      text: "INSERT INTO OPERATIONS(contract, installation_report, carrier_id) VALUES($1, $2, $3)",
      values: [contract, report, carrier_id],
    };
    await pool.query(query);
    return res.status(201).json({
      success: true,
      message: "La operación se ha creado correctamente",
      data: req.body,
      files: req.files,
    });
  } catch (error: any) {
    if (
      error?.code === "22P02" ||
      (error?.code === "23503" && error?.constraint.includes("carrier_id"))
    )
      return res.status(400).json({
        success: false,
        message: `El id del portador no es correcta. Verifique que esta exista en la base de datos para realizar esta acción.`,
      });
    if (error?.code === "23505" && error?.constraint.includes("carrier_id"))
      return res.status(400).json({
        success: false,
        message: `Al parecer este portador ya tiene una operación creada.`,
      });
    if (error?.code === "23502" && error?.column === "carrier_id")
      return res.status(400).json({
        success: false,
        message: `Es necesario indicar un portador para la agregar una operación.`,
      });
    return res.json({
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};

// const queries = () => {}
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
      files: req.files,
    });
  } catch (error: any) {
    return res.json({
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
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
