const User = require("../models/Utilizador");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError, NotFoundError } = require("../errors");
// const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const sanitizeHtml = require('sanitize-html');

const getAllUser = async (req, res) => {
  try {
    const UsersAll = await User.find();

    if (!UsersAll) {
      throw new NotFoundError(`Não foi encontrado nenhum utilizador`);
    }


    res.status(StatusCodes.OK).json({ UsersAll });
  } catch (error) {
    console.error("getAllUser ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const getAllUserTipo = async (req, res) => {
  try {
    let {
      params: { tipo: tipo },
    } = req;

    const UsersAllTipo = await User.find({ tipo: tipo, estado: true }, { _id: 1, nome: 1 });

    if (!UsersAllTipo) {
      throw new NotFoundError(`Não foi encontrado nenhum utilizador`);
    }
    res.status(StatusCodes.OK).json({ UsersAllTipo });
  } catch (error) {
    console.error("getAllUserTipo ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};



const getUser = async (req, res) => {
  try {
    let {
      params: { id: userID },
    } = req;
    userID = sanitizeHtml(userID);
    const user = await User.findOne({
      _id: userID,
    });
    if (!user) {
      throw new NotFoundError(`Nenhum utilizador com id: ${userID}`);
    }
    res.status(StatusCodes.OK).json({ user });

  } catch (error) {
    console.error("getUser ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};


const getUserTipo = async (req, res) => {
  try {
    let {
      params: { id: userID },
    } = req;
    userID = sanitizeHtml(userID);
    const user = await User.findOne(
      { _id: userID },
      'tipo'  // Projection to only include the 'Tipo' field
    );
    if (!user) {
      throw new NotFoundError(`Nenhum utilizador com id: ${userID}`);
    }
    res.status(StatusCodes.OK).json({ tipo: user.tipo });

  } catch (error) {
    console.error("getUser ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};



const postResetPassword = async (req, res) => {
  try {
    let { email: email } = req.params;
    email = sanitizeHtml(email);
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      throw new NotFoundError(`Nenhum utilizador com email: ${email} encontrado`);
    }

    if (user.estado === false) {
      throw new Error('Conta encontra-se inativa!');
    }

    // Generate a password reset token
    const token = crypto.randomBytes(20).toString('hex');


    // Set the token and its expiration date in the user's document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour

    // Save the updated user document
    await user.save();
    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Create a nodemailer transporter
    /*const transporter = nodemailer.createTransport({
      // Configure your email service provider details
      service: process.env.SERVICE,
      auth: {
        user: process.env.EMAIL, // Enter your email address
        pass: process.env.PASSWORD_EMAIL // Enter your email password
      }
    });
    */

    // Generate a password reset link
    const resetLink = `${process.env.LOCALHOSTCLIENT}/paginaResetPasswordChange/${token}`;

    // Configure the email details
    const mailOptions = {
      from: process.env.EMAIL, // Sender's email address
      to: email, // Recipient's email address
      subject: 'Password Reset',
      html: `
        <p>Este email foi enviado porque você (alguem) fez um pedido para resetar a password da sua conta na aplicação Gestao de Horas.</p>
        <p>Pressione o seguinte link para resetar a sua password:</p>
        <a href="https://${resetLink}">https://${resetLink}</a>
        <p>Se não realizou este pedido por favor ignore este email!</p>
        `
    };
    // Send the email
    //await transporter.sendMail(mailOptions);
    await sgMail.send(mailOptions);
    // Send a success response
    res.json({ message: 'Foi enviado um email para resetar a password.' });
  } catch (error) {
    // Send an error response
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      console.error("postResetPassword ", error);
    } else {
      console.error("postResetPassword ", error);
      res.status(500).json({ error: 'Ocorreu um erro ao tentar resetar a senha, por favor tente novamente.' });
    }
  }
};

// Express route for handling the password update request
const updateResetedPassword = async (req, res) => {
  //const { token } = req.params;
  try {
    let { token } = req.body;
    let { password } = req.body;
    token = sanitizeHtml(token);
    password = sanitizeHtml(password);

    // Find the user by the reset password token and check if it has not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Token inválido ou expirado!');
    }

    if (user.estado === false) {
      throw new Error('Conta encontra-se inativa!');
    }
    // Update the user's password
    user.password = password;

    // Clear the reset password token and its expiration date
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user document
    await user.save();

    // Send a success response
    res.json({ message: 'Password alterada com sucesso' });
  } catch (error) {
    console.error("updateResetedPassword ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};




const getUserEmail = async (req, res) => {
  try {
    let {
      params: { Email: Email, userID: userID },
    } = req;

    Email = sanitizeHtml(Email);
    userID = sanitizeHtml(userID);
    const user = await User.findOne({
      _id: userID,
    });
    if (!user) {
      throw new NotFoundError(`Nenhum utilizador com id: ${userID}`);
    }
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.error("getUserEmail ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const register = async (req, res) => {
  try {
    let { login, password, codigo, email, nome, tipo, responsavel } = req.body;

    login = sanitizeHtml(login);
    password = sanitizeHtml(password);
    codigo = sanitizeHtml(codigo);
    email = sanitizeHtml(email);
    nome = sanitizeHtml(nome);
    tipo = sanitizeHtml(tipo);
    responsavel = sanitizeHtml(responsavel);
    let foto = req.body.foto;

    const sanitizedFoto = {};
    for (const key in foto?.data) {
      if (Object.hasOwnProperty.call(foto?.data, key)) {
        sanitizedFoto[key] = sanitizeHtml(foto?.data[key]);
      }
    }
    try {

      const buffer = Buffer.from(new Uint8Array(Object?.values(sanitizedFoto)));// convert the Uint8Array to a Buffer

      const user = await User.create({
        login,
        password,
        codigo,
        email,
        nome,
        tipo,
        foto: {
          data: buffer,
          contentType: 'image/png'
        },
        estado: true,
        responsavel: responsavel,
      });

      res.status(StatusCodes.CREATED).json({
        user: {
          login: user.login,
          password: user.password,
          codigo: user.codigo,
          email: user.email,
          foto: {
            data: buffer,
            contentType: 'image/png'
          },
          nome: user.nome,
          tipo: user.tipo,
          estado: user.estado,
          responsavel: responsavel,
        },
      });
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        // Duplicate key error (MongoDB error code)
        const duplicateKey = Object.keys(error.keyPattern)[0];
        res.status(StatusCodes.CONFLICT).json({ error: `Valor duplicado. O valor '${duplicateKey}' já se encontra em uso.` });
      } else {
        // Other errors
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Falha no Registo.' });
      }
    }
  } catch (error) {
    console.error("register ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};



const login = async (req, res) => {
  try {
    console.log("LOGIN")
    let { email, password } = req.body;
    email = sanitizeHtml(email);
    password = sanitizeHtml(password);

    if (!email || !password) {
      throw new BadRequestError("");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Credenciais Invalidas");
    } else {
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Password incorreta");
      }
    }

    var timestamp = user?._id?.getTimestamp();

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
        estado: user.estado,
        responsavel: user.responsavel,
        timestamp: timestamp,
        token,
      },
    });
  } catch (error) {
    console.error("login ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const updateUser = async (req, res) => {
  try {
    let { login, password, codigo, email, nome, tipo, estado, _id } = req.body;

    login = sanitizeHtml(login);
    password = sanitizeHtml(password);
    codigo = sanitizeHtml(codigo);
    email = sanitizeHtml(email);
    nome = sanitizeHtml(nome);
    tipo = sanitizeHtml(tipo);
    if (estado !== true && estado !== false) {
      estado = sanitizeHtml(estado);
    }

    _id = sanitizeHtml(_id);

    let foto = req.body?.foto;

    const sanitizedFoto = {};

    for (const key in foto?.data) {
      if (Object.hasOwnProperty.call(foto?.data, key)) {
        sanitizedFoto[key] = sanitizeHtml(foto?.data[key]);
      }
    }
    try {
      const buffer = Buffer.from(new Uint8Array(Object?.values(sanitizedFoto)));// convert the Uint8Array to a Buffer
      // Generate a password reset token
      const tokenP = crypto.randomBytes(20).toString('hex');

      // Set the token and its expiration date in the user's document

      if (!login || !email || !email || !foto || !nome || !tipo) {
        throw new BadRequestError("Insira todos os valores");
      }

      const user = await User.findOne({ _id: _id });

      user.id = _id;
      user.login = login;
      user.password = password;
      user.codigo = codigo;
      user.email = email;
      user.nome = nome;
      user.tipo = tipo;

      if (buffer) {
        user.foto = {
          data: buffer,
          contentType: 'image/png' // set the content type of the file to the foto.contentType property
        };
      }

      user.estado = estado;
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
          estado: user.estado,
          token,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Falha no registo.' });
    }
  } catch (error) {
    console.error("updateUser ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};


const updateUserType = async (req, res) => {
  try {
    let { tipo, _id, responsavel } = req.body;

    responsavel = sanitizeHtml(responsavel);
    tipo = sanitizeHtml(tipo);
    _id = sanitizeHtml(_id);

    try {
      const user = await User.findOne({ _id: _id });

      user.tipo = tipo;
      user.responsavel = responsavel;
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
          estado: user.estado,
          token,
        },
      });

    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Falha no registo.' });
    }
  } catch (error) {
    console.error("updateUserType ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    let {
      params: { id: utilizadorId },
    } = req;

    utilizadorId = sanitizeHtml(utilizadorId);

    const utilizador = await User.findOneAndDelete({
      _id: utilizadorId,
    });
    if (!utilizador) {
      throw new NotFoundError(`Não existe nenhum utilizador com este id ${utilizadorId}`);
    }
    res.status(StatusCodes.OK).send();
  } catch (error) {
    console.error("deleteUser ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  register,
  login,
  getUser,
  getUserTipo,
  getUserEmail,
  getAllUser,
  updateUser,
  updateUserType,
  deleteUser,
  postResetPassword,
  updateResetedPassword,
  getAllUserTipo,
};
