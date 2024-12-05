import { Request, Response, NextFunction } from "express";
import HttpException from "../interfaces/exceptions/http.exception";

function ErrorMiddleware(
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).send({
    status,
    message,
  });
}

export default ErrorMiddleware;
