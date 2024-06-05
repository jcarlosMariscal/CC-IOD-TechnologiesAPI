export interface ErrorResponse {
  status: number;
  success: boolean;
  message: string;
  error?: any;
}

export const handleDatabaseError = (error: any): ErrorResponse => {
  const success = false;
  let message = "Ocurrió un error en el servidor. Intente de nuevo más tarde.";
  let status = 500;

  if (error?.code === "22007") {
    status = 400;
    message = "Verifique que la fecha sea correcta";
  } else if (error?.code === "23505") {
    status = 400;
    if (error.constraint.includes("electronic_bracelet")) {
      message = "El brazalete ya está registrado a otro portador.";
    } else if (error.constraint.includes("beacon")) {
      message = "El BEACON ya está registrado a otro portador.";
    } else if (error.constraint.includes("wireless_charger")) {
      message = "El cargador inalámbrico ya está registrado a otro portador.";
    } else if (error.constraint.includes("client_id")) {
      message = "El ID cliente ya ha sido registrado.";
    } else if (error.constraint.includes("contract_number")) {
      message = "El contrato ya existe en base de datos.";
    } else if (error.constraint.includes("defendant_name")) {
      message = "El nombre del imputado ya está registrado";
    } else if (error.constraint.includes("prospect_id")) {
      message = "El prospecto ya se registró como cliente.";
    } else if (error.constraint.includes("email")) {
      message = "Ya existe un usuario con este correo registrado.";
    }
  } else if (error?.code === "23503") {
    status = 400;
    if (error.constraint.includes("relationship_id")) {
      message = "Seleccione un parentesco válido.";
    } else if (error.constraint.includes("status")) {
      message = "El estado seleccionado no existe.";
    } else if (error.constraint.includes("client_id")) {
      message = "El cliente con el id proporcionado no existe.";
    } else if (error.constraint.includes("carrier_id")) {
      message = "No es posible eliminar a un portador que es un cliente.";
    } else if (error.constraint.includes("prospect_id")) {
      message = "No es posible eliminar a un prospecto que es un cliente.";
    }
  }

  return { status, success, message, error };
};

import { Response } from "express";

interface ResponseParams {
  status: number;
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

export const sendResponse = (
  res: Response,
  { status, success, message, data, error }: ResponseParams
): void => {
  res.status(status).json({ success, message, data, error });
};

export const sendSuccess = (
  res: Response,
  message: string,
  data?: any
): void => {
  sendResponse(res, {
    status: 200,
    success: true,
    message,
    data,
  });
};
export const sendCreated = (
  res: Response,
  message: string,
  data?: any
): void => {
  sendResponse(res, {
    status: 201,
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  status: number,
  message: string,
  error?: any
): void => {
  sendResponse(res, {
    status,
    success: false,
    message,
    data: error,
  });
};
