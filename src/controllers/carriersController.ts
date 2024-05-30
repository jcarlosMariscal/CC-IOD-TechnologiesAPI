import { NextFunction, Request, Response } from "express";
import { pool } from "../database/connection";

export const getAllCarriers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const query =
      "SELECT carrier_id as id, residence_area, placement_date, placement_time, electronic_bracelet, beacon, wireless_charger, information_emails, house_arrest, installer_name, A.observations, A.client_id, A.relationship_id, B.defendant_name as name, C.name as relationship_name FROM CARRIERS A INNER JOIN CLIENTS B ON A.client_id = B.client_id INNER JOIN RELATIONSHIPS C ON A.relationship_id = C.relationship_id ORDER BY carrier_id";
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún portador." });
    return res.status(200).json({
      success: true,
      message: "Información de todos los portadores",
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getCarrierById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const carrier_id = parseInt(req.params.id);
  try {
    const query = {
      name: "get-client-id",
      text: "SELECT carrier_id as id, residence_area, placement_date, placement_time, electronic_bracelet, beacon, wireless_charger, information_emails, house_arrest, installer_name, A.observations, A.client_id, A.relationship_id, B.defendant_name as name, C.name as relationship_name FROM CARRIERS A INNER JOIN CLIENTS B ON A.client_id = B.client_id INNER JOIN RELATIONSHIPS C ON A.relationship_id = C.relationship_id WHERE carrier_id = $1",
      values: [carrier_id],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún portador." });
    return res.status(201).json({
      success: true,
      message: "Datos del portador obtenidos",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const createCarrier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const {
    residence_area,
    placement_date,
    placement_time,
    electronic_bracelet,
    beacon,
    wireless_charger,
    information_emails,
    house_arrest,
    installer_name,
    observations,
    client_id,
    relationship_id,
  } = req.body;
  try {
    const obserOptional = observations ? observations : "";
    const emails = JSON.stringify(information_emails);

    const client = await pool.query(
      "SELECT status FROM CLIENTS WHERE client_id = $1",
      [client_id]
    );
    const cStatus = client.rows[0].status;
    if (
      cStatus === "Pendiente de aprobación" ||
      cStatus === "Pendiente de audiencia"
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Para agregar un portador este debe estar como cliente en estado "Pendiente de colocación" o "Colocado"',
      });
    }
    const query = {
      text: "INSERT INTO CARRIERS(residence_area, placement_date, placement_time, electronic_bracelet, beacon, wireless_charger, information_emails, house_arrest, installer_name, observations, client_id, relationship_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING carrier_id",
      values: [
        residence_area,
        placement_date,
        placement_time,
        electronic_bracelet,
        beacon,
        wireless_charger,
        emails,
        house_arrest,
        installer_name,
        obserOptional,
        client_id,
        relationship_id,
      ],
    };
    const result = await pool.query(query);
    if (result.rowCount) {
      const carrier_id = result.rows[0].carrier_id;
      const query = {
        text: "INSERT INTO OPERATIONS(carrier_id) VALUES($1)",
        values: [carrier_id],
      };
      await pool.query(query);
    }
    return res.status(201).json({
      success: true,
      message: "El prospecto se ha creado correctamente",
      data: req.body,
    });
  } catch (error: any) {
    next(error);
  }
};
export const updateCarrier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const carrier_id = parseInt(req.params.id);
  const {
    residence_area,
    placement_date,
    placement_time,
    electronic_bracelet,
    beacon,
    wireless_charger,
    information_emails,
    house_arrest,
    installer_name,
    observations,
    client_id,
    relationship_id,
  } = req.body;
  try {
    const obserOptional = observations ? observations : "";
    const emails = JSON.stringify(information_emails);

    const query = {
      text: "UPDATE CARRIERS SET residence_area=$1, placement_date=$2, placement_time=$3, information_emails=$4, house_arrest=$5, installer_name=$6, observations=$7, relationship_id=$8 WHERE carrier_id=$9",
      values: [
        residence_area,
        placement_date,
        placement_time,
        emails,
        house_arrest,
        installer_name,
        obserOptional,
        relationship_id,
        carrier_id,
      ],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún portador." });
    return res.status(201).json({
      success: true,
      message: "El portador se ha modificado correctamente",
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteCarrier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const carrier_id = parseInt(req.params.id);
  try {
    const query = {
      text: "DELETE FROM CARRIERS WHERE carrier_id = $1",
      values: [carrier_id],
    };
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "El portador que desea eliminar no se encuentra." });
    return res.status(201).json({
      success: true,
      message: `El portador ${carrier_id} ha sido eliminado`,
    });
  } catch (error: any) {
    next(error);
  }
};
// 203
