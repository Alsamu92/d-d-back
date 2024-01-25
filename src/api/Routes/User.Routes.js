const { isAuth } = require('../../middleware/auth.middleware');
const {
  subirUser,
  borrarUser,

  login,
 
  getAll,
  buscarNameUser,
  BuscarUser,
  autologin,
  medalla,
  update,

} = require('../Controllers/User.Controllers');

const UserRoutes = require('express').Router();

UserRoutes.get('/', getAll);
UserRoutes.get('/byName/:name', buscarNameUser);
UserRoutes.get('/:id', BuscarUser);
UserRoutes.patch('/medalla/:medalla', [isAuth],medalla);
UserRoutes.post('/', subirUser);
UserRoutes.post('/autologin', autologin);
UserRoutes.patch('/actualizar',[isAuth], update);


UserRoutes.post('/login', login);




UserRoutes.delete('/', borrarUser);


module.exports = UserRoutes;
