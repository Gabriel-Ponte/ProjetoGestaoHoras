require("dotenv").config();

const mockData = require("./data.json");

const Job = require("./models/Projeto");
const connectDB = require("./db/connectDB");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Job.create(mockData);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
