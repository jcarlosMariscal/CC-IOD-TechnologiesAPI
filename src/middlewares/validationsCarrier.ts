import { NextFunction, Request, Response } from "express";
import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

// Middleware para validaciones
const prospectSchema = Joi.object({
  // residence_area: Joi.number().integer().required().messages({
  //   "any.required": "El número de contrato es obligatorio",
  //   "number.empty": "El número de contrato no puede estar vacío",
  //   "number.base": "El número de contrato debe ser un número",
  //   "number.integer": "El número de contrato debe ser un número entero.",
  // }),
  residence_area: Joi.string().required().messages({
    "any.required": "La Zona de residencia del cliente es obligatorio",
    "string.empty": "La Zona de residencia del cliente no puede estar vacío",
    "string.base": "La Zona de residencia del cliente debe ser una cadena.",
  }),
  // hearing_date: Joi.date().required().messages({
  //   "any.required": "La fecha de audiencia es obligatoria",
  //   "string.empty": "La fecha de audiencia no puede estar vacío",
  // }),
  placement_date: Joi.date()
    .format(["YYYY-MM-DD", "YYYY/MM/DD"])
    .required()
    .messages({
      "any.required": "La fecha de colocación es obligatoria",
      "date.base": "La fecha de colocación debe ser una fecha válida.",
      "date.format": "El formato de la fecha debe ser YYYY-MM-DD.",
    }),
  placement_time: Joi.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.empty": "La hora de colocación no puede estar vacía.",
      "string.pattern.base":
        "La hora de colocación debe estar en formato HH:mm (24 horas).",
      "any.required": "La hora de colocación es obligatorio.",
    }),
  electronic_bracelet: Joi.string().required().messages({
    "any.required": "El brazalete electrónico es obligatorio",
    "string.empty": "El brazalete electrónico no puede estar vacío",
    "string.base": "El brazalete electrónico debe ser una cadena",
  }),
  beacon: Joi.string().required().messages({
    "any.required": "El BEACON es obligatorio",
    "string.empty": "El BEACON no puede estar vacío",
    "string.base": "El BEACON debe ser una cadena",
  }),
  wireless_charger: Joi.string().required().messages({
    "any.required": "El cargador inalámbrico es obligatorio",
    "string.empty": "El cargador inalámbrico no puede estar vacío",
    "string.base": "El cargador inalámbrico debe ser una cadena",
  }),
  information_emails: Joi.array()
    .items(Joi.string().email())
    .min(1)
    .required()
    .messages({
      "array.base": "Los correos deben estar en un arreglo.",
      "array.min": "Ingrese al menos un correo electrónico",
      "string.base": "El correo debe ser una cadena de texto",
      "string.email": "El correo electrónico no es válido",
      "any.required": "Los correos para información son obligatorios",
    }),
  house_arrest: Joi.string().required().messages({
    "any.required": "El arraigo domiciliario es obligatorio",
    "string.empty": "El arraigo domiciliario no puede estar vacío",
    "string.base": "El arraigo domiciliario debe ser una cadena",
  }),
  installer_name: Joi.string().required().messages({
    "any.required": "El nombre del instalador es obligatorio",
    "string.empty": "El nombre del instalador no puede estar vacío",
    "string.base": "El nombre del instalador debe ser una cadena",
  }),
  observations: Joi.string().optional(),
  client_id: Joi.number().integer().required().messages({
    "any.required": "Debe haber un cliente a la cuál definir como portador.",
    "number.empty": "El id del cliente es necesario.",
    "number.base": "El id del cliente debe ser un número",
    "number.integer": "El id del cliente debe ser un número entero",
  }),
  relationship_id: Joi.number().integer().required().messages({
    "any.required": "Debe seleccionar un parentesco",
    "number.empty": "Debe seleccionar un parentesco",
    "number.base": "El id de la relación debe ser un número",
    "number.integer": "El id del parentesco debe ser un número entero",
  }),
});
export const validationsCarrier = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = prospectSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
