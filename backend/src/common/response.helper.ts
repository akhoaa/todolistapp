import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

export function successResponse(res: Response, data: any, message = 'Success', statusCode = HttpStatus.OK) {
  return res.status(statusCode).json({ statusCode, message, data });
}

export function errorResponse(res: Response, error: any, defaultMessage = 'Error') {
  const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || defaultMessage;
  return res.status(statusCode).json({ statusCode, message });
} 