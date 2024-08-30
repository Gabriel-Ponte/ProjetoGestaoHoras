const mongoose = require("mongoose");
const Counter = require("./idCounter");


const PagamentosSchema = new mongoose.Schema(
    {
        _id_Pa: {
            type: Number,
            default: 0,
        },
        Mes: {
            type: Number,
            //required: [true, "Please provide a valid Date"],
            default: 0,
        },

        Ano: {
            type: Number,
            required: [true, "Por favor insira um numero de Horas"],
        },
        
        Horas: {
            type: String,
            required: true
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

PagamentosSchema.pre('save', async function(next) {
    const doc = this;
    const sequence = await Counter.findOneAndUpdate(
        { _id_Pa: '_id_Pa' },
        { $inc: { sequence_valuePa: 1 } },
        { returnOriginal: false, upsert: true }
    );
    doc._id_Pa = sequence.sequence_valuePa;
    next();
});

module.exports = mongoose.model("Pagamentos", PagamentosSchema);