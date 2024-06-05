import { JwtPayload } from "../models/jwt.interface";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

export const generateToken = (
  payload: JwtPayload,
  expiresIn = "6h"
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });
};
