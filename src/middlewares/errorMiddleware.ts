import { Request, Response, NextFunction } from "express";
import { handleDatabaseError, sendResponse } from "../helpers/errorHandlers";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorResponse = handleDatabaseError(err);
  sendResponse(res, errorResponse);
};
