const express = require('express')
const pool = require('./query.js')
require("dotenv").config();
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
const { authenticate } = require('./middwares/auth.js')


const app = express()
const port = 3002

const movieRouter = require('./movieRouter.js')
const userRouter = require('./userRouter.js')
const swaggerdoc = require('./sweggerdoc.json');

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())


app.use('/users', userRouter);
app.use(authenticate);
app.use('/movies', movieRouter);
// Rute untuk dokumentasi Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerdoc));

app.listen(port, () => {
  console.log(`running on port ${port}`)
});
