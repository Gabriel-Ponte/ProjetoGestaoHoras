const User = require("../models/Utilizador");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError , NotFoundError} = require("../errors");
const { formToJSON } = require("axios");
const multer = require("multer");


const getAllUser = async (req, res) => {
  const UsersAll = await User.find();

  if (!UsersAll) {
    throw new NotFoundError(`No Users found`);
  }
  res.status(StatusCodes.OK).json({ UsersAll });
};


const getUser = async (req, res) => {
  const {
    params: { id: userID },
  } = req;

  const user = await User.findOne({
    _id : userID,
  });
  if (!user) {
    throw new NotFoundError(`No utilizador with id ${userID}`);
  }
  res.status(StatusCodes.OK).json({ user });
};




const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      login: user.login,
      password: user.password,
      codigo: user.codigo,
      email: user.email,
      foto: user.foto,
      nome: user.nome,
      tipo: user.tipo,
    },
  });
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  // compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      login: user.login,
      password: user.password,
      codigo: user.codigo,
      email: user.email,
      foto: user.foto,
      nome: user.nome,
      tipo: user.tipo,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  const { login, password, codigo, email, nome, tipo, _id } = req.body;
  const foto = req.body.foto;
  const buffer = Buffer.from(new Uint8Array(Object.values(foto.data)));// convert the Uint8Array to a Buffer

  if ( !login || !email || !codigo || !email || !foto|| !nome || !tipo ) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: _id });
  user.id = _id;
  user.login = login;
  user.password = password;
  user.codigo = codigo;
  user.email = email;
  user.foto = {
    data: buffer,
    contentType: 'image/png' // set the content type of the file to the foto.contentType property
  };
  user.nome = nome;
  user.tipo = tipo;
  await user.save();


  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      login: user.login,
      password: user.password,
      codigo: user.codigo,
      email: user.email,
      foto: user.foto,
      nome: user.nome,
      tipo: user.tipo,
      token,
    },
  });
};


const deleteUser = async (req, res) => {
  const {
    params: { id: utilizadorId },
  } = req;
  const utilizador = await User.findByIdAndRemove({
    _id: utilizadorId,
  });
  if (!utilizador) {
    throw new NotFoundError(`Não existe nenhum utilizador com este id ${utilizadorId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  register,
  login,
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
};
