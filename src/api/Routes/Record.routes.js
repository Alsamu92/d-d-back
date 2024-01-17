const { isAuth } = require('../../middleware/auth.middleware');
const { crearRecord } = require('../Controllers/Record.Controllers');

const RecordRoutes = require('express').Router();


RecordRoutes.post('/',[isAuth], crearRecord);





module.exports = RecordRoutes;
