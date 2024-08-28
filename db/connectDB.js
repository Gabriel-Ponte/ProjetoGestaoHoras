const mongoose = require('mongoose')

const client = async(url) => {
  // return mongoose.connect(url)
  return mongoose.connect(url, {
    autoIndex: false, // Avoids potential index creation issues
    enableUtf8Validation: false,
}).catch(err => console.error('MongoDB connection error:', err));

}

module.exports = client;