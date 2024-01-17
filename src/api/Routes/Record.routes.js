const { isAuth } = require('../../middleware/auth.middleware');
const { crearRecord, sortRecords } = require('../Controllers/Record.Controllers');

const RecordRoutes = require('express').Router();


RecordRoutes.post('/',[isAuth], crearRecord);
RecordRoutes.get('/filtrodes/:filtro', sortRecords);





module.exports = RecordRoutes;
