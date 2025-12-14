const express = require("express");
const { config } = require("dotenv")
const mongoose = require("mongoose"); 
const bodyParser = require("body-parser");
config();

const bookRoutes = require("./routes/bookRoutes");

//express para middleware, PARSEA JSON  
const app = express()
app.use(bodyParser.json());


// CONEXION A DB
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server iniciado en puerto ${port}`);
});
