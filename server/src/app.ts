import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';

import createConnection from './database';
import { router } from './routes';
import { AppError } from './models/AppError';

createConnection();
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'tmp', 'uploads')));

app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if(err instanceof AppError){
    return response.status(err.statusCode).json({
      message: err.message
    })
  }

  return response.status(500).json({
    status: "Error",
    message: `Internal server error ${err.message}`
  })
})

export { app };