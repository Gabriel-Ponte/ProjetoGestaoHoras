require("dotenv").config();
require("express-async-errors");

const path = require("path");
const fs = require("fs");

const imagePath = path.join(__dirname, "/images", "DefaultUserImg.png");
const imageBuffer = fs.readFileSync(imagePath);

// extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");

const express = require("express");
const app = express();

const connectDB = require("./db/connectDB");
const authenticateUser = require("./middleware/authentication");
//const populate = require("./populate");

// routers
const authRouter = require("./routes/auth");
const utilizadorRouter = require("./routes/utilizador");
const projetosRouter = require("./routes/projetos");
const diaRouter = require("./routes/dia");
const tipoTrabalhoRouter = require("./routes/tipoTrabalho");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const cors = require('cors');

app.use(cors());


app.set("trust proxy", 1);

app.use(express.static(path.resolve(__dirname, "./client/build/")));
app.use(express.json());
app.use(helmet());
app.use(xss());



// routes
app.use("/inicio", authRouter);
app.use("/utilizador",authenticateUser, utilizadorRouter);
app.use("/projetos",authenticateUser, projetosRouter);
app.use("/dia", authenticateUser, diaRouter);
app.use("/tipoTrabalho", authenticateUser, tipoTrabalhoRouter);

app.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
  next(); 
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/public/", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
    
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
