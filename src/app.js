import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index.routes.js';

dotenv.config();
const { ACCESS } = process.env;

const server = express();

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));

server.use(
  cors({
    origin: function (origin, callback) {
      if (ACCESS.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// server.use((req, res, next) => {
//   console.log('Recibida solicitud:');
//   console.log('Método:', req.method);
//   console.log('URL:', req.url);
//   console.log('Headers:', JSON.stringify(req.headers, null, 2));
//   console.log('Body:', JSON.stringify(req.body, null, 2));
//   next();
// });
server.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome - 👌' });
});
server.use('/', router);
// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

export default server;
