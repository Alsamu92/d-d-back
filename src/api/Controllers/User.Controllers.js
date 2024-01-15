const bcrypt = require('bcrypt');
const { generateToken } = require('../../utils/token');
const User = require('../models/User.model');


//todo-----------CONTROLADOR PARA SUBIR NUEVO USUARIO-------------------
const subirUser = async (req, res, next) => {


  try {
    await User.syncIndexes();
  
    const { username} = req.body;
    const userExiste = await User.findOne(
      { username: req.body.username},
    );
    if (!userExiste) {
      const newUser = new User({ ...req.body});
      try {
        const usuarioGuardado = await newUser.save();
        if(usuarioGuardado){
          return(res.status(200).json(usuarioGuardado))
        }else{
          return(res.status(404).json("No guarado"))
        }
       } catch (error) {
        return res.status(404).json({
          error: 'error al guardar',
          message: error.message,
        });
      }
    } else {
      return res.status(404).json('El ususario ya existe');
    }
  } catch (error) {
    next(error);
    return (
      res.status(404).json({
        mensaje: 'Error al crear',
        error: error,
      }) && next(error)
    );
  }
};

//todo---------------------------------------------------------------------

//todo-----------LOGIN-------------------

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userDb = await User.findOne({ username });

    if (userDb) {
      //Si existe y conincide la pass generar el token
      if (bcrypt.compareSync(password, userDb.password)) {
        const token = generateToken(userDb._id,username);

        return res.status(200).json({
          user: userDb,
          token,
        });
      } else {
        return res.status(404).json('La contraseña no coincide');
      }
    } else {
      return res.status(404).json('usuario no registrado');
    }
  } catch (error) {
    return next(error);
  }
};

//todo---------------------------------------------------------------------
//todo-----------CONTROLADOR PARA BORRAR USUARIO-------------------

const borrarUser = async (req, res) => {
  try {
    const { _id } = req.user;
    // Eliminar el usuario por su ID
    const userDelete = await User.findById(_id);
    await User.findByIdAndDelete(_id);
    console.log(req.user.image);
    // Eliminar la imagen asociada al usuario en Cloudinary
    deleteImgCloudinary(userDelete.image);
    try {
      // Actualizar los documentos en la colección "User" eliminando el ID del usuario del array "followed"
      await User.updateMany({ followed: _id }, { $pull: { followed: _id } });
      try {
        // Actualizar los documentos en las colecciones "Articulo" y "Supermercado" eliminando el ID del usuario del array "likes"
        await Articulo.updateMany({ likes: _id }, { $pull: { likes: _id } });
        try {
          await Supermercado.updateMany(
            { likes: _id },
            { $pull: { likes: _id } }
          );

          // Eliminar todos los comentarios hechos por el usuario
          const comentarios = await Comentario.find({ publicadoPor: _id });
          //Uso for of porque foreach me pide que haga asincrona la callback y prefiero asi.
          for (const comentario of comentarios) {
            await Comentario.findByIdAndDelete(comentario._id);
            await Articulo.updateMany(
              { comentarios: comentario._id },
              { $pull: { comentarios: comentario._id } }
            );
          }

          const existUser = await User.findById(_id);

          if (existUser) {
            return res.status(404).json({
              deleteTest: false,
            });
          } else {
            return res.status(200).json({
              deleteTest: true,
            });
          }
        } catch (error) {
          return res.status(404).json({
            message: 'Error al actualizar los supermercados',
            error: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          message: 'Error al actualizar los likes',
          error: error.message,
        });
      }
    } catch (error) {
      return res.status(404).json({
        message: 'Error al actualizar los followed',
        error: error.message,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: 'Error al borrar',
      error: error.message,
    });
  }
};
//! ----------------------- AUTOLOGIN ---------------------------------
const autologin = async (req, res, next) => {
  try {
    const { username, password } = req.body; //? -  la contraseña en este caso, es la encriptada, ya que la sacamos nosotros del backend, no nos lo da el user
    const userDB = await User.findOne({ username }); //? buscamos si hay algun usuario registrado con ese email
    if (userDB) {
      if (password === userDB.password) {
        //? cogemos la contraseña que nos ha dado el backend dp de ponerla el usuario (como nos la da el backend, ya esta encriptada)
        //? y NOSOTROS la metemos en el body al hacer el autologin, por lo tanto el body es email + contraseña encriptada y las comparamos. en el login se compara la de texto plano con la encriptada
        const token = generateToken(userDB._id,username);
        return res.status(200).json({ user: userDB, token }); //? le damos el token al user (userDB) para que sea suyo
      } else {
        return res
          .status(404)
          .json('password is incorrect (does not match) ❌');
      }
    } else {
      return res.status(404).json('User not found/is not registered 🔎❌');
    }
  } catch (error) {
    return next(setError(500, error.message || 'Error en el autologin ❌'));
  }
};


//todo-----------------------------------------------------------------------------------------------------------------------------------------

//todo CONTROLADOR BUSCAR POR ID

const BuscarUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userPorId = await User.findById(id);
    if (userPorId) {
      return res.status(200).json(userPorId);
    } else {
      return res.status(404).json('No se ha encontrado');
    }
  } catch (error) {
    return res.status(404).json('No encontrado');
  }
};
//todo-----------------------------------------------------------------------------------------------------------------------------------------
//todo CONTROLADOR BUSCAR Todos

const getAll = async (rq, res) => {
  try {
    const todosLosUsers = await User.find();
    if (todosLosUsers.length > 0) {
      return res.status(200).json(todosLosUsers);
    } else {
      return res.status(404).json('No se han encontrado usuarios');
    }
  } catch (error) {
    return res.status(404).json({
      error: 'error al buscar',
      message: error.message,
    });
  }
};
//todo-----------------------------------------------------------------------------------------------------------------------------------------

//todo CONTROLADOR BUSCAR POR NOMBRE
const buscarNameUser = async (req, res) => {
  try {
    const { username } = req.params;
    const nombreUser = await User.find({ username });
    if (nombreUser.length > 0) {
      return res.status(200).json(nombreUser);
    } else {
      return res.status(404).json('No se ha encontado este usuario');
    }
  } catch (error) {
    return res.status(404).json({
      error: 'No encontrado',
      message: error.message,
    });
  }
};
//todo---------------------------------------------------------------------

module.exports = {
  subirUser,
  borrarUser,
autologin,
  login,
 getAll,
  buscarNameUser,
  BuscarUser,

};
