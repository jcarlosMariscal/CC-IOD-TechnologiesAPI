import { NextFunction, Request, Response } from "express";
import Joi from "joi";

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
  relationship_id: Joi.number().required().messages({
    "any.required": "Debe seleccionar un parentesco",
    "string.empty": "Debe seleccionar un parentesco",
  }),
  status: Joi.string().valid("Pendiente", "Aprobado").required().messages({
    "any.required": "El estado es obligatorio",
    "string.base": "El estado debe ser un texto.",
    "any.only": 'El estado debe ser "Pendiente" o "Aprobado".',
  }),
  date: Joi.date().required().messages({
    "any.required": "La fecha es obligatorio",
    "string.empty": "La fecha no puede estar vacío",
  }),
  observations: Joi.string().optional(),
});
export const validateProspect = (
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
