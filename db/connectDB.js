const mongoose = require('mongoose')

<<<<<<< HEAD
const connectDB = async(url) => {
=======
const client = async(url) => {
  // return mongoose.connect(url)
>>>>>>> 493ca391511a8fef4d9eac4d0a749b0bb864100e
  return mongoose.connect(url, {
    autoIndex: false, // Avoids potential index creation issues
    enableUtf8Validation: false,
}).catch(err => console.error('MongoDB connection error:', err));
<<<<<<< HEAD
=======

>>>>>>> 493ca391511a8fef4d9eac4d0a749b0bb864100e
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