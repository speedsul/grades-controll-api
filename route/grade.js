import express from 'express';
import { promises as fs } from 'fs';
const { readFile, writeFile } = fs;
global.dataGrade = 'grades.json';
global.dateTime = new Date();
const route = express.Router();

route.get('/', async (req, res) => {
  const data = JSON.parse(await readFile(global.dataGrade));
  console.log(data.grades);
  res.send(data.grades);
});
route.post('/', async (req, res, next) => {
  try {
    let grade = req.body;

    const dataRead = JSON.parse(await readFile(global.dataGrade));
    grade.grades = {
      id: dataRead.nextId++,
      ...grade,
      timestamp: dateTime,
    };
    dataRead.grades.push(grade.grades);
    await writeFile(global.dataGrade, JSON.stringify(dataRead, null, 2));
    res.send(grade.grades);
  } catch (err) {
    next(err);
  }
});
route.put('/', async (req, res, next) => {
  try {
    let grade = req.body;
    const id = parseInt(grade.id);

    const data = JSON.parse(await readFile(global.dataGrade));
    const index = data.grades.findIndex((i) => i.id === id);
    data.grades[index] = grade;
    await writeFile(global.dataGrade, JSON.stringify(data, null, 2));
    res.send({ message: 'Grade atualizado com sucesso' });
  } catch (err) {
    next(err);
  }
});
route.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = JSON.parse(await readFile(global.dataGrade));
    const dataFind = data.grades.filter((i) => i.id !== id);
    let dataSave = [];
    dataSave = { grades: dataFind };
    console.log(dataSave);
    await writeFile(global.dataGrade, JSON.stringify(dataSave, null, 2));
    res.send({ message: 'Grade deletada com sucesso' });
  } catch (err) {
    next(err);
  }
});
route.get('/:id', async (req, res, next) => {
  //get by id
  try {
    const id = parseInt(req.params.id);
    console.log(id);
    const data = JSON.parse(await readFile(global.dataGrade));
    const dataFilter = data.grades.find((i) => i.id === id);
    res.send(dataFilter);
  } catch (err) {
    next(err);
  }
});
route.get('/:student/:subject', async (req, res, next) => {
  try {
    const student = req.params.student;
    const subject = req.params.subject;
    const data = JSON.parse(await readFile(global.dataGrade));

    const filterStudent = data.grades.filter(
      (f) => f.student === student && f.subject === subject
    );

    const totalPoints = filterStudent.reduce((acumulator, current) => {
      return current.value + acumulator;
    }, 0);
    console.log(filterStudent, subject);
    res.send({ estudante: filterStudent, totalNota: totalPoints });
  } catch (err) {
    next(err);
  }
});
route.get('/type/:type/:subject', async (req, res, next) => {
  try {
    const type = req.params.type;
    const subject = req.params.subject;
    const data = JSON.parse(await readFile(global.dataGrade));

    const filterTypeAndSubject = data.grades.filter(
      (f) => f.type === type && f.subject === subject
    );
    const quantidade = filterTypeAndSubject.length;

    const totalPoints = filterTypeAndSubject.reduce((acumulator, current) => {
      return current.value + acumulator;
    }, 0);
    const filterTreeGood = filterTypeAndSubject.sort(
      (a, b) => b.value - a.value
    );
    const treeGood = filterTreeGood.slice(0, 3);
    console.log(treeGood);
    const dataFilter = {
      estudante: filterTypeAndSubject,
      totalNota: totalPoints,
      media: totalPoints / quantidade,
      tresMelhores: treeGood,
    };
    res.send(dataFilter);
  } catch (err) {
    next(err);
  }
});
route.use((err, req, res, next) => {
  console.log(err);
  res.status(400).send({ error: err.message });
});

export default route;
