const mongoose = require('mongoose')


const connectDB = async (url) => {
  if (!url) {
    throw new Error(
      'MONGO_URI is not defined — check the .env file / PM2 environment.'
    );
  }

  // NOTE: do NOT swallow the error here. Letting it reject lets the caller
  // fail fast with the real cause (e.g. "querySrv ENOTFOUND ..." when the
  // Atlas cluster no longer exists) instead of starting the server anyway
  // and having every query time out with "buffering timed out after 10000ms".
  return mongoose.connect(url, {
    autoIndex: false, // Avoids potential index creation issues
    enableUtf8Validation: false,
    serverSelectionTimeoutMS: 10000, // fail within 10s instead of hanging
  });
};

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