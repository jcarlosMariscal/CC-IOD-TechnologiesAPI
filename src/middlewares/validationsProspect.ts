import { NextFunction, Request, Response } from "express";
import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);
// Middleware para validaciones
const prospectSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "El nombre es obligatorio",
    "string.empty": "El nombre no puede estar vacío",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "El correo es obligatorio",
    "string.empty": "El correo no puede estar vacío",
    "string.email": "El correo electrónico no es válido",
  }),
  phone: Joi.string()
    .regex(/^\d{10}$/)
    .required()
    .messages({
      "any.required": "El teléfono es obligatorio",
      "string.empty": "El teléfono no puede estar vacío",
      "string.pattern.base": "El teléfono no es válido",
    }),
  relationship_id: Joi.number().integer().required().messages({
    "any.required": "Debe seleccionar un parentesco",
    "number.empty": "Debe seleccionar un parentesco",
    "number.base": "El id de la relación debe ser un número",
    "number.integer": "El id del parentesco debe ser un número entero",
  }),
  status: Joi.string().valid("Pendiente", "Aprobado").required().messages({
    "any.required": "El estado es obligatorio",
    "string.base": "El estado debe ser un texto.",
    "any.only": 'El estado debe ser "Pendiente" o "Aprobado".',
  }),
  date: Joi.date().format(["YYYY-MM-DD", "YYYY/MM/DD"]).required().messages({
    "any.required": "La fecha es obligatorio",
    "date.base": "La fecha debe ser una fecha válida.",
    "date.format": "El formato de la fecha debe ser YYYY-MM-DD.",
  }),
  observations: Joi.string().allow("").optional().messages(),
});
export const validationsProspect = (
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
