
import { User } from "../models/user.model.js";
import { validateEmail } from "../helpers/validator.helpers.js";
import bcrypt from 'bcrypt';

import { generateJwt } from "../helpers/token.helpers.js";
import { response } from "express";


// Crear nuevo usuario
export const createUser = async (req, res) => {
  const { name, lastName, email, password } = req.body;

  if (!name) {
    return res
      .status(403)
      .json({ response: 'error', message: 'El nombre es obligatorio' });
  }

  if (!lastName) {
    return res
      .status(403)
      .json({ response: 'error', message: 'El apellido es obligatorio' });
  }

  if (!email) {
    return res
      .status(403)
      .json({ response: 'error', message: 'El email es obligatorio' });
  }

  if (!validateEmail(email)) {
    return res
      .status(403)
      .json({ response: 'error', message: 'El email no es válido' });
  }

  if (!password) {
    return res
      .status(403)
      .json({ response: 'error', message: 'El password es obligatorio' });
  }

  if (password.length < 6) {
    return res.status(403).json({
      response: 'error',
      message: 'El password debe contener al menos 6 caracteres',
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      lastName,
      email,
      password: passwordHashed,
    });

    const savedUser = await user.save();
    const access_token = generateJwt(savedUser._id);

    return res.status(200).json({
      response: 'success',
      user: {
        access_token,
        name,
        lastName,
      },
    });
  } catch (error) {
    console.log(error);

    let message = 'Error del servidor';

    if (error.code === 11000) {
      message = 'El usuario ya se encuentra registrado en la base de datos.';
    }

    return res.status(500).json({
      response: 'error',
      message,
    });
  }
};

// Login del usuario
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(403)
      .json({ response: 'error', message: 'El email es obligatorio' });
  }

  if (!password) {
    return res
      .status(403)
      .json({ response: 'error', message: 'El password es obligatorio' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res
      .status(404)
      .json({ response: 'error', message: 'Usuario no encontrado' });
  }

  const compare = await bcrypt.compare(password, user.password);

  if (!compare) {
    return res
      .status(401)
      .json({ response: 'error', message: 'Email o password incorrectos' });
  }

  try {
    const access_token = generateJwt(user._id);

    return res.status(200).json({
      response: 'success',
      user: {
        access_token,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      response: 'error',
      message: 'Error del servidor al ingresar el usuario',
    });
  }
};

// Obtener el usuario de la sesión
export const getMe = async (req, res) => {
  const { user } = req;
  return res.status(200).json(user);
};

    

