import express from 'express';
import route from './route/grade.js';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
global.dataGrade = 'grades.json';
const app = express();
app.use(express.json());
app.use('/grades', route);

app.listen(process.env.PORT || 3000, async () => {
  try {
    await readFile(global.dataGrade);
    console.log('API STARTED');
  } catch (err) {
    const initialJason = {
      nextId: 1,
      accounts: [],
    };
    await writeFile(global.dataGrade, JSON.stringify(initialJason))
      .then(() => console.log('API-Started and file created'))
      .catch((err) => console.log('Erro ao iniciar API', err));
  }
});
