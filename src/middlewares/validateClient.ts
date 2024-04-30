import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Middleware para validaciones
const prospectSchema = Joi.object({
  contractNumber: Joi.number().integer().required().messages({
    "any.required": "El número de contrato es obligatorio",
    "number.empty": "El número de contrato no puede estar vacío",
    "number.base": "El número de contrato debe ser un número",
    'number.integer': 'El número de contrato debe ser un número entero.',
  }),
  defendantName: Joi.string().required().messages({
    "any.required": "El nombre del imputado es obligatorio",
    "string.empty": "El nombre del imputado no puede estar vacío",
    "string.base": "El nombre del imputado debe ser una cadena.",
  }),
  criminalCaseNumber: Joi.number().integer().required().messages({
    "any.required": "El número de causa penal es obligatorio",
    "number.empty": "El número de causa penal no puede estar vacío",
    "number.base": "El número de causa penal debe ser númerico",
    'number.integer': 'El número de causa penal debe ser un número entero.',
  }),
  investigationFileNumber: Joi.number().integer().required().messages({
    "any.required": "El número de carpeta de investigación es obligatorio",
    "number.empty": "El número de carpeta de investigación no puede estar vacío",
    "number.base": "El número de carpeta de investigación debe ser númerico",
    'number.integer': 'El número de carpeta de investigación debe ser un número entero.',
  }),
  judgeName: Joi.string().required().messages({
    "any.required": "El nombre del Juez es obligatorio",
    "string.empty": "El nombre del Juez no puede estar vacío",
  }),
  courtName: Joi.string().required().messages({
    "any.required": "El nombre del Juzgado es obligatorio",
    "string.empty": "El nombre del Juzgado no puede estar vacío",
  }),
  lawyerName: Joi.string().required().messages({
    "any.required": "El nombre del Abogado es obligatorio",
    "string.empty": "El nombre del Abogado no puede estar vacío",
  }),
  signerName: Joi.string().required().messages({
    "any.required": "El nombre de quién firma el contrato es obligatorio",
    "string.empty": "El nombre de quién firma el contrato no puede estar vacío",
  }),
  contactNumbers: Joi.array().items(Joi.string().length(10).pattern(/^\d{10}$/)).min(1).required().messages({
    'array.base': 'El campo debe ser un arreglo.',
    'array.min': 'Ingrese al menos un número de contacto',
    'string.length': 'Cada número telefónico debe contener exactamente 10 dígitos.',
    'string.pattern.base': 'Cada número telefónico debe contener solo dígitos numéricos.',
    'any.required': 'Los contactos son obligatorios'
  }),
  hearingDate: Joi.date().required().messages({
    "any.required": "La fecha de audiencia es obligatoria",
    "string.empty": "La fecha de audiencia no puede estar vacío",
  }),
  status: Joi.string().valid('Pendiente de aprobación', 'Pendiente de audiencia', 'Pendiente de colocación', 'Colocado').required().messages({
    "any.required": "El estado es obligatorio",
    'string.base': 'El estado debe ser un texto.',
    'any.only': 'El estado debe ser "Pendiente de aprobación", "Pendiente de audiencia", "Pendiente de colocación" o "Colocado".'
  }),
  observations: Joi.string().optional(),
  prospectId: Joi.number().required().messages({
    "any.required": "Debe haber un prospecto a la cuál definir como cliente.",
    "string.empty": "El id del prospecto es necesario.",
  }),
});
export const validateClient = (
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