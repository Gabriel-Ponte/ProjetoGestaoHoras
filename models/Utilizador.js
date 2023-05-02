const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Counter = require("./idCounter");
const fs = require("fs");
const path = require("path");
const imagePath = path.join(__dirname, "../images", "DefaultUserImg.png");
const imageBuffer = fs.readFileSync(imagePath);



const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true, "Please provide name"],
        maxlength: 50,
        minlength: 3,
        unique: true,
    },

    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
    },

    codigo: {
        type: String,
        default: 1,
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
        unique: true,
    },
    foto: {
        data: {
          type: Buffer,
          //required: true,
          default: imageBuffer,
        },
        contentType: {
          type: String,
          default: 'image/png',
          //required: true
        }
      },
    nome: {
        type: String,
        required: [true, "Please provide name"],
        maxlength: 50,
        minlength: 3,
    },
    tipo: {
        type: Number,
        trim: true,
        maxlength: 20,
        default: "2",
    },
});

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return; // Prevents hash the already hashed password when updating other fields
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, name: this.name },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};


module.exports = mongoose.model("Utilizadores", UserSchema);
