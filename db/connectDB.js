const mongoose = require('mongoose')

const client = (url) => {
  
  return mongoose.connect(url)
}

module.exports = client;