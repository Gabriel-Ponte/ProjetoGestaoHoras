const mongoose = require("mongoose");
const Counter = require("./idCounter");



const ProjectSchema = new mongoose.Schema(
    {
        _id_P: {
            type: Number,
            default: 0,
        },
        Nome: {
            type: String,
            required: [true, "Por favor insira um nome para o projeto"],
            maxlength: 1000,
        },
        Tema: {
            type: String,
            required: [true, "Por favor insira um tema"],
            maxlength: 1000,
        },
        Cliente: {
            type: String,
            default: "Recursos Internos",
        },
        Acao: {
            type: String,
            required: [true, "Por favor insira uma ação"],
        },
        DataInicio: {
            type: Date ,
            default: "",
        },
        DataObjetivo: {
            type: Date ,
            default: "",
        },
        DataFim: {
            type: Date ,
            default: "",
        },
        TipoTrabalho: {
            type: String,
            //required: [true, "Por favor insira um Tipo de Trabalho"],
        },

        Piloto: {
            type: String,
            default: "Todos",
        },

        Notas: {
            type: String,
            default: "",
        },
        Links: {
            type: String,
            default:"",
            required: false,
        },
        NumeroHorasTotal: {
            type: Number,
            required: false,
        },
        OrçamentoAprovado: {
            type: String,
            enum: ["","Aprovado", "Reprovado", "Em espera"],
            default: "Em espera",
        },
        Finalizado: {
            type: Boolean,
            default: false,
            required: false,
        },
        Resultado: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    { timestamps: true }
);

ProjectSchema.pre('save', async function(next) {
    const doc = this;
    const sequence = await Counter.findOneAndUpdate(
        { _id_P: '_id_P' },
        { $inc: { sequence_value: 1 } },
        { returnOriginal: false, upsert: true }
    );
    doc._id_P = sequence.sequence_value;
    next();
});



module.exports = mongoose.model("Projeto", ProjectSchema);
