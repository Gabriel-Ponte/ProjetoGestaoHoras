const mongoose = require("mongoose");
const Counter = require("./idCounter");



// Define schema for tipoTrabalhoHoras
const TipoTrabalhoHorasSchema = new mongoose.Schema({
    projeto: {
      type: String,
      required: true,
      //type: mongoose.Schema.Types.ObjectId,
      //ref: 'Projeto'
    },
    tipoTrabalho: {
      type: String,
      required: true
    },
    horas: {
      type: String,
      required: true
    }
  });

const DiasSchema = new mongoose.Schema(
    {
        _id_D: {
            type: Number,
            default: 0,
        },
        Data: {
            type: Date,
            //required: [true, "Please provide a valid Date"],
            default: "",
        },
        NumeroHoras: {
            type: Number,
            required: [true, "Por favor insira um numero de Horas"],
        },
        tipoDeTrabalhoHoras: {
            type: [TipoTrabalhoHorasSchema],
            required: true,
        },
        Utilizador: {
            //type: mongoose.Types.ObjectId,
            //ref: "Utilizador",
            type: String,
            required: [true, "Por favor insira um utilizador"],
            default:"",
        },
        accepted: {
          type: Number,
          default: 0,
        },
        associated: {
          type: String,
          required: false,
        },
        _id_Group: {
          type: Number,
          default: 0,
      },
    },
    { timestamps: true }
);

DiasSchema.pre('save', async function(next) {
    const doc = this;
    const sequence = await Counter.findOneAndUpdate(
        { _id_D: '_id_D' },
        { $inc: { sequence_valueD: 1 } },
        { returnOriginal: false, upsert: true }
    );
    doc._id_D = sequence.sequence_valueD;
    next();
});

async function upgradeGroup() {
  try {
    const sequence = await Counter.findOneAndUpdate(
      { _id_Group: '_id_Group' },
      { $inc: { sequence_valueD: 1 } },
      { returnOriginal: false, upsert: true }
    );

    const groupId = sequence.sequence_valueD;

    return groupId; // Return the groupId for use by the caller
  } catch (error) {
    next(error); // Pass the error to the next error-handling middleware
  }
}



module.exports = {
    TipoTrabalhoHoras: mongoose.model("TipoTrabalhoHoras", TipoTrabalhoHorasSchema),
    Dias: mongoose.model("Dias", DiasSchema),
    upgradeGroup,
  };