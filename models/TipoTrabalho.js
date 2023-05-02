const mongoose = require("mongoose");


const TipoTrabalhoSchema = new mongoose.Schema({
    TipoTrabalho: {
        type: String,
        required: [true, "Insira um valor Possivel"],
        maxlength: 50,
        minlength: 1,
        unique: true,
        },
    }
);

module.exports = mongoose.model("TipoTrabalho", TipoTrabalhoSchema);