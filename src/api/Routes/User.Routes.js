const {
  subirUser,
  borrarUser,

  login,
 
  getAll,
  buscarNameUser,
  BuscarUser,
  autologin,

} = require('../Controllers/User.Controllers');

const UserRoutes = require('express').Router();

UserRoutes.get('/', getAll);
UserRoutes.get('/byName/:name', buscarNameUser);
UserRoutes.get('/:id', BuscarUser);

UserRoutes.post('/', subirUser);
UserRoutes.post('/autologin', autologin);


UserRoutes.post('/login', login);




UserRoutes.delete('/', borrarUser);


module.exports = UserRoutes;
