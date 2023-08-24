const mongoose = require("mongoose");


const TipoTrabalhoSchema = new mongoose.Schema({
    TipoTrabalho: {
        type: String,
        required: [true, "Insira um valor Possivel"],
        maxlength: 50,
        minlength: 1,
        unique: true,
        },
        tipo: {
            type: Number,
            trim: true,
            maxlength: 2,
            default: "1",
        },
    }
);

module.exports = mongoose.model("TipoTrabalho", TipoTrabalhoSchema);