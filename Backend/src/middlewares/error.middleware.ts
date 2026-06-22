import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { WeatherApiValidationError } from '../errors/WeatherApiValidationError';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) 
{
  if (err instanceof WeatherApiValidationError) {
    return res.status(502).json({
      message: err.message,
      details: err.details
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: err.flatten()
    });
  }

  return res.status(500).json({
    message: "Error interno del servidor"
  });
}
