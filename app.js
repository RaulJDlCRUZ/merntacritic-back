import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import debug from "debug";
const debugInstance = debug("merntacritic-back:server");

import dotenv from 'dotenv';
dotenv.config({ override: true });

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import gamesRouter from './routes/games.js';
import salesRouter from './routes/sales.js';
import longtobeatRouter from './routes/longtobeat.js';
import awardsRouter from './routes/awards.js';
import rankingsRouter from './routes/rankings.js';
import favRouter from './routes/favs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

// Habilita CORS para todas las solicitudes
app.use(
  cors({
    origin: process.env.FRONTEND, // Permite solicitudes desde tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
  })
);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));


// Rutas de la aplicación
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/games', gamesRouter);
app.use('/sales', salesRouter);
app.use('/longtobeat', longtobeatRouter);
app.use('/awards', awardsRouter);
app.use('/rankings', rankingsRouter);
app.use('/favs', favRouter);

/* Conexión a la base de datos */
const fullURI = process.env.MONGODB_URI + process.env.MONGODB_NAME;
mongoose
  .connect(fullURI)
  .then(() => debugInstance("MongoDB DataBase connection successful"))
  .catch(err => debugInstance("MongoDB connection error:", err));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
