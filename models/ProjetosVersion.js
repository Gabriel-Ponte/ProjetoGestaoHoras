const mongoose = require("mongoose");
const Counter = require("./idCounter");



const ProjectVersioningSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: 0,
        },
        _id_P: {
            type: Number,
            default: 0,
        },
        Versao: {
            type: Number,
            required: false,
            default: 1
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
        LinkResumo: {
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



ProjectVersioningSchema.pre('save', async function(next) {
    const doc = this;
    next();
});



module.exports = mongoose.model("ProjetoVersionamento", ProjectVersioningSchema);
