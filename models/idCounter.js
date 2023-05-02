const { date } = require("joi");
const mongoose = require("mongoose");


const CounterSchema = new mongoose.Schema(
    {
    _id_U: String, sequence_valueU: Number, 
    _id_P: String, sequence_value: Number, 
    _id_D: String, sequence_valueD: Number,
    
});

module.exports = mongoose.model("counters", CounterSchema);