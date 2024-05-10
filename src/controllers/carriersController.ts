import { Request, Response } from "express";
import { pool } from "../database/connection";

export const getAllCarriers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query = "SELECT * FROM CARRIERS";
    const result = await pool.query(query);
    if (!result.rowCount)
      return res
        .status(404)
        .json({ message: "No se encontró ningún portador." });
    return res.status(201).json({
      success: true,
      message: "Información de todos los portadores",
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

export const getCarrierById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const carrier_id = parseInt(req.params.id);
  try {
    const query = {
      name: "get-client-id",
      text: "SELECT * FROM CARRIERS WHERE carrier_id = $1",
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
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};

export const createCarrier = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
    const optionalData = observations ? observations : "";
    const emails = JSON.stringify(information_emails);

    const query = {
      text: "INSERT INTO CARRIERS(residence_area, placement_date, placement_time, electronic_bracelet, beacon, wireless_charger, information_emails, house_arrest, installer_name, observations, client_id, relationship_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
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
        optionalData,
        client_id,
        relationship_id,
      ],
    };
    await pool.query(query);
    return res.status(201).json({
      success: true,
      message: "El portador se ha creado correctamente",
      data: req.body,
    });
  } catch (error: any) {
    if (error?.code === "22007")
      return res.status(400).json({
        success: false,
        message: "Verifique que la fecha sea correcta",
      });
    if (
      error?.code === "23505" &&
      error.constraint.includes("electronic_bracelet")
    )
      return res.status(400).json({
        success: false,
        message: `El brazalete ${electronic_bracelet} ya está registrado a otro portador.`,
      });
    if (error?.code === "23505" && error.constraint.includes("beacon"))
      return res.status(400).json({
        success: false,
        message: `El BEACON ${beacon} ya está registrado a otro portador.`,
      });
    if (
      error?.code === "23505" &&
      error.constraint.includes("wireless_charger")
    )
      return res.status(400).json({
        success: false,
        message: `El cargador inalámbrico ${wireless_charger} ya está registrado a otro portador`,
      });
    if (error?.code === "23503" && error.constraint.includes("relationship_id"))
      return res.status(400).json({
        success: false,
        message:
          "Parece que no existe el parentesco seleccionado. Seleccione una correcta",
      });
    if (error?.code === "23505" && error.constraint.includes("client_id"))
      return res.status(400).json({
        success: false,
        message: `Al parecer el cliente que intenta agregar ya ha sido registrado como cliente.`,
      });
    if (error?.code === "23503" && error.constraint.includes("client_id"))
      return res.status(400).json({
        success: false,
        message: `El cliente con el id #${client_id} no existe en base de datos, por lo que no es posible registrarlo como portador.`,
      });
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
export const updateCarrier = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
    const optionalData = observations ? observations : "";
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
        optionalData,
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
    if (error?.code === "22007")
      return res.status(400).json({
        success: false,
        message: "Verifique que la fecha sea correcta",
      });
    if (error?.code === "23503" && error.constraint.includes("relationship_id"))
      return res.status(400).json({
        success: false,
        message:
          "Parece que no existe el parentesco seleccionado. Seleccione una correcta",
      });
    // if (error?.code === "23505" && error.constraint.includes("client_id"))
    //   return res.status(400).json({
    //     success: false,
    //     message: `Al parecer el cliente que intenta agregar ya ha sido registrado como cliente.`,
    //   });
    // if (error?.code === "23503" && error.constraint.includes("client_id"))
    //   return res.status(400).json({
    //     success: false,
    //     message: `El cliente con el id #${client_id} no existe en base de datos, por lo que no es posible registrarlo como portador.`,
    //   });
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};

export const deleteCarrier = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
    if (error?.code === "23503" && error.constraint.includes("carrier_id"))
      return res.status(400).json({
        success: false,
        message:
          "No es posible eliminar a este portador debido a que es un cliente.",
      });
    return res.status(500).json({
      success: false,
      message:
        "Ha ocurrido un error en el servidor. Intente de nuevo más tarde",
      error,
    });
  }
};
