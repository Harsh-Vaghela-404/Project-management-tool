import express from 'express';
import bodyParser from 'body-parser';
import { connectDb } from './model/connection';
let userRoute = require('./controller/user');
let taskRoute = require('./controller/task');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

connectDb();

app.use('/users', userRoute)
app.use('/task',taskRoute);

console.log(process.env.DB_HOST);

var server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = server;