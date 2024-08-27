const mongoose = require("mongoose");
const Counter = require("./idCounter");


const FeriasSchema = new mongoose.Schema(
    {
        _id_F: {
            type: Number,
            default: 0,
        },
        Ano: {
            type: Number,
            //required: [true, "Please provide a valid Date"],
            default: "",
        },

        Numero: {
            type: Number,
            required: [true, "Por favor insira um numero de Dias"],
        },  

        Utilizador: {
            type: String,
            required: [true, "Por favor insira um utilizador"],
            default:"",
        },
        UtilizadorResponsavel: {
            type: String,
            required: [true, "Por favor insira um utilizador Responsavel"],
            default:"",
        },
    },
    { timestamps: true }
);


FeriasSchema.pre('save', async function(next) {
    const doc = this;
    const sequence = await Counter.findOneAndUpdate(
        { _id_F: '_id_F' },
        { $inc: { sequence_value: 1 } },
        { returnOriginal: false, upsert: true }
    );
    doc._id_F = sequence.sequence_value;
    next();
});

module.exports = mongoose.model("Ferias", FeriasSchema);