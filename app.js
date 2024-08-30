require("dotenv").config();
require("express-async-errors");
const path = require("path");
const https = require('https');
const fs = require("fs");
const helmet = require("helmet");
const xss = require("xss");
const express = require("express");
const cors = require('cors');
const compression = require('compression');
const app = express();
const { connectDB } = require("./db/connectDB");
const authenticateUser = require("./middleware/authentication");

// Routers
const authRouter = require("./routes/auth");
const utilizadorRouter = require("./routes/utilizador");
const projetosRouter = require("./routes/projetos");
const diaRouter = require("./routes/dia");
const tipoTrabalhoRouter = require("./routes/tipoTrabalho");
const pagamentoRouter = require("./routes/pagamento");
const feriasRouter = require("./routes/ferias");

// Error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const key = fs.readFileSync(path.resolve(__dirname, 'certs/key.pem'));
const cert = fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem'));


// Security middlewares
app.use(helmet());
app.use(compression());

// CORS middleware
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));

// Set UTF-8 encoding for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Serve static files
app.use(express.static(path.resolve(__dirname, "./client/build/")));

// Middleware to parse JSON bodies and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ limit: '500mb',extended: true }));

// Route for XSS sanitization
app.post('/sanitizedInput', (req, res) => {

  const sanitizedInput = xss(req.body.input);
  res.send({ sanitizedInput });
});

// Define routes
app.use("/inicio", authRouter);
app.use("/utilizador", authenticateUser, utilizadorRouter);
app.use("/projetos", authenticateUser, projetosRouter);
app.use("/dia", authenticateUser, diaRouter);
app.use("/tipoTrabalho", authenticateUser, tipoTrabalhoRouter);
app.use("/pagamento", authenticateUser, pagamentoRouter);
app.use("/ferias", authenticateUser, feriasRouter);


// Catch-all route for serving the client app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/public/", "index.html"));
});

// Error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start HTTPS server
const port = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const server = https.createServer({ key, cert }, app);
    
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });


    // // Memory usage monitoring
    // setInterval(() => {
    //   const memoryUsage = process.memoryUsage();
    //   console.log(`Memory Usage: ${JSON.stringify(memoryUsage)}`);
    // }, 30000); // Log memory usage every 30 seconds
    

    // app.listen(port, () =>
    
    //   console.log(`Server is listening on port ${port}...`)
    // );
  } catch (error) {
    console.error(error);
  }
};

start();
