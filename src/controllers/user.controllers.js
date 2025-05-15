
import { User } from "../models/user.model.js";
import { validateEmail } from "../helpers/validator.helpers.js";
import bcrypt from 'bcrypt';

import { generateJwt } from "../helpers/token.helpers.js";
import { response } from "express";


// CREAR USUARIO 

export const createUser = async (req, res) => {
  
const { name, lastname, email, password } = req.body;
console.log({name,lastname, email, password});

if (!name){
    return res.status(403).json({response: 'error', message:'El nombre es obligatorio'});
}

if (!lastname){
    return res.status(403).json({response: 'error', message:'El apellido es obligatorio'});
}
if (!email){
    return res.status(403).json({response: 'error', message:'El email es obligatorio'});
}
if (!validateEmail(email)){
    return res.status(403).json ({ response: 'error', message:'El email no es valido'})
}

if (!password){
    return res.status(403).json({response: 'error', message:'La contraseña es obligatoria'});

}

try {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);

    const user = new User({
        name, 
        lastname, 
        email, 
        password: passwordHashed,
    });

    
    const savedUser = await user.save();
    const access_token = generateJwt(savedUser._id);

    // Enviando respuesta exitosa
    return res.status(200).json({
        response: "success", 
        message: "Usuario creado correctamente", 
        user: {
            access_token,
            name,
            lastname,
            email: savedUser.email,
        },
    });

} catch (error) {
    console.log(error); 
    
    
        let message = 'Error del servidor'

        if (error.code === 11000) {
            message = 'El usuario ya se encuenta en la base de datos ';
        }
    
    // Log para depuración
    return res.status(500).json({
        response: "error", 
        message,
    });
}

}


//LOGIN DEL USUARIO

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
        lastname: user.lastname,
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


    

