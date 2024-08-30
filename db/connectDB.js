const mongoose = require('mongoose')


const connectDB = async(url) => {

  return mongoose.connect(url, {
    autoIndex: false, // Avoids potential index creation issues
    enableUtf8Validation: false,
}).catch(err => console.error('MongoDB connection error:', err));
}

const closeConnection = async (connection) => {
  try {
    await connection.disconnect();
    console.info('MongoDB connection closed.');
  } catch (err) {
    console.error('MongoDB disconnection error:', err);
  }
};

module.exports = {
  connectDB,
  closeConnection,
};