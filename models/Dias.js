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
            // default: "",
        },
        NumeroHoras: {
            type: Number,
            required: [true, "Por favor insira um numero de Horas"],
        },
        tipoDeTrabalhoHoras: {
            type: [TipoTrabalhoHorasSchema],
            required: [true, "Por favor insira um tipo de Trabalho"],
        },
        Utilizador: {
            //type: mongoose.Types.ObjectId,
            //ref: "Utilizador",
            type: String,
            required: [true, "Por favor insira um utilizador"],
        },
        accepted: {
          type: Number,
          default: 0,
        },
        associated: {
          type: String,
          default: "",
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
      { $inc: { sequence_valueG: 1 } },
      { returnOriginal: false, upsert: true }
    );

<<<<<<< HEAD
    return sequence.sequence_valueG; 
=======
    const groupId = sequence.sequence_valueD;

    return groupId; // Return the groupId for use by the caller
>>>>>>> 493ca391511a8fef4d9eac4d0a749b0bb864100e
  } catch (error) {
    console.error("UpgradeGroup" , error)
    throw new Error('Failed to upgrade group ID'); // Throw error to be handled by the caller
  }
}



module.exports = {
    TipoTrabalhoHoras: mongoose.model("TipoTrabalhoHoras", TipoTrabalhoHorasSchema),
    Dias: mongoose.model("Dias", DiasSchema),
    upgradeGroup,
  };