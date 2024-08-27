const { date } = require("joi");
const mongoose = require("mongoose");


const CounterSchema = new mongoose.Schema(
    {
    codigo: String, sequence_valueU: Number,
    //_id_U: String, sequence_valueU: Number, 
    _id_P: String, sequence_value: Number, 
    _id_D: String, sequence_valueD: Number,
    _id_Pa: String, sequence_valuePa: Number,
    _id_F: String, sequence_valuePa: Number,
    _id_Group: String, sequence_valuePa: Number,
});

module.exports = mongoose.model("counters", CounterSchema);