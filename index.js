const express = require('express')
const pool = require('./query.js')
const bodyParser = require('body-parser')
require("dotenv").config();
const { authenticate } = require('./middwares/auth.js')

const app = express()
const port = 3002

const movieRouter = require('./movieRouter.js')
const userRouter = require('./userRouter.js')

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())


app.use('/users', userRouter);
//app.use(authenticate);
app.use('/movies', movieRouter);


app.listen(port, () => {
  console.log(`running on port ${port}`)
});