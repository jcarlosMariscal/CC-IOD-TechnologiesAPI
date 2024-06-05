import { NextFunction, Request, Response } from "express";
import Joi from "joi";
const nameValidation = {
  name: Joi.string().required().messages({
    "any.required": "El nombre es obligatorio",
    "string.empty": "El nombre no puede estar vacío",
  }),
};

const roleIdValidation = {
  role_id: Joi.number().valid(2, 3).integer().optional().messages({
    "number.base": "El rol debe ser un número.",
    "any.only": "El rol debe ser Director o Administrativo",
    "number.integer": "El rol debe ser un número entero.",
  }),
};

const emailValidation = {
  email: Joi.string().email().required().messages({
    "any.required": "El correo es obligatorio",
    "string.empty": "El correo no puede estar vacío",
    "string.email": "El correo electrónico no es válido",
  }),
};
const passwordValidation = {
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
  ...nameValidation,
  ...roleIdValidation,
  ...emailValidation,
  ...passwordValidation,
});
const updateUserSchema = Joi.object({
  ...nameValidation,
  ...roleIdValidation,
  ...emailValidation,
});
const updateAdminSchema = Joi.object({
  ...nameValidation,
  ...emailValidation,
});
const loginSchema = Joi.object({ ...emailValidation, ...passwordValidation });
const changePassSchema = Joi.object({ ...passwordValidation });
const emailSchema = Joi.object({ ...emailValidation });

export const validationsRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
export const validationsUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
export const validationsUpdateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateAdminSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
export const validationEmail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = emailSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
export const validationChangePass = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = changePassSchema.validate(req.body);
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
