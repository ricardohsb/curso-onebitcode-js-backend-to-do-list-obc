const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const checkListRouter = require('./src/routes/checklist')


app.use(express.json())

app.use('/checklists',checkListRouter)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
