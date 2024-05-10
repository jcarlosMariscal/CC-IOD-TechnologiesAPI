import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const commonValidationRules = {
  email: Joi.string().email().required().messages({
    "any.required": "El correo es obligatorio",
    "string.empty": "El correo no puede estar vacío",
    "string.email": "El correo electrónico no es válido",
  }),
  password: Joi.string()
    .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/)
    .required()
    .messages({
      "any.required": "La contraseña es obligatoria",
      "string.empty": "La contraseña no puede estar vacía",
      "string.pattern.base":
        "La contraseña debe contener un dígito del 1 al 9, una letra minúscula, una letra mayúscula, un carácter especial, sin espacios y debe tener mínimo 8 caracteres.",
    }),
};

const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "El nombre es obligatorio",
    "string.empty": "El nombre no puede estar vacío",
  }),
  ...commonValidationRules,
});
const loginSchema = Joi.object({ ...commonValidationRules });

export const validationsRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
export const validationsLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
