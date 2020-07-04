import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import rateLimitMiddleware from './middlewares/rate-limit-request.middleware';
import '../typeorm';
import '@shared/container';

const app = express();
app.use(rateLimitMiddleware);
app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3333, () => {
  console.log('Started server on port 3333');
});
