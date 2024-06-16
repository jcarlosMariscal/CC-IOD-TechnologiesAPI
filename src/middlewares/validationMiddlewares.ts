import { NextFunction, Request, Response } from "express";
import {
  carrierSchema,
  clientSchema,
  prospectSchema,
} from "../models/modelSchemas";

const messageArrValues = (message: string): string => {
  return message.includes("information_emails")
    ? "Ingrese al menos un correo para información"
    : message.includes("contact_numbers")
    ? "Ingrese al menos un número de contacto"
    : message;
};

export const validationsProspect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = prospectSchema.validate(req.body);
  if (error) {
    const message = messageArrValues(error.details[0].message);
    return res.status(400).json({ success: false, message });
  }
  next();
};
export const validationsClient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = clientSchema.validate(req.body);
  if (error) {
    const message = messageArrValues(error.details[0].message);
    return res.status(400).json({ success: false, message });
  }
  next();
};
export const validationsCarrier = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = carrierSchema.validate(req.body);
  if (error) {
    const message = messageArrValues(error.details[0].message);
    return res.status(400).json({ success: false, message });
  }
  next();
};
