const express = require("express");
const mongoose = require("mongoose"); 
const bodyParser = require("body-parser");
const { config } = require("dotenv");
config();

const bookRoutes = require('./routes/book.routes');

//express para middleware, PARSEA JSON  
const app = express()
app.use(bodyParser.json()); //parseador bodies


// CONEXION A DB
mongoose.connect(process.env.MONGODB_URL, {dbName: process.env.MONGO_DB_NAME})
const port = process.env.PORT || 3000;
const db = mongoose.connection;

app.use('/books', bookRoutes);

app.listen(port, () => {
  console.log(`Server iniciado en puerto ${port}`);
});
