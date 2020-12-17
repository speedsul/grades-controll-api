import express from 'express';
import winston from 'winston';
import route from './route/grade.js';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}[${label}] ${level}: ${message}`;
});
global.dataGrade = 'grades.json';
global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'grades-control-api.log',
    }),
  ],
  format: combine(
    label({ label: 'grades-control-api' }),
    timestamp(),
    myFormat
  ),
});

const app = express();
app.use(express.json());
app.use('/grades', route);

app.listen(process.env.PORT || 3000, async () => {
  try {
    await readFile(global.dataGrade);
    logger.info('API STARTED');
  } catch (err) {
    const initialJason = {
      nextId: 1,
      accounts: [],
    };
    await writeFile(global.dataGrade, JSON.stringify(initialJason))
      .then(() => log.info('API-Started and file created'))
      .catch((err) => log.error('Erro ao iniciar API', err.message));
  }
});
