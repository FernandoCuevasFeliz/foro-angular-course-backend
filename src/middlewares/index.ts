import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import JwtStrategy from './passport/index';

function middlewares(app: Express) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(passport.initialize());
  passport.use(JwtStrategy);
  app.use(cors());
  // // Configurar cabeceras y cors
  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  //   );
  //   res.header(
  //     'Access-Control-Allow-Methods',
  //     'GET, POST, OPTIONS, PUT, DELETE'
  //   );
  //   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  //   next();
  // });
}

export default middlewares;
