const Record = require("../models/Record.model");
const User = require("../models/User.model");


const crearRecord = async (req, res, next) => {
  try {
      await Record.syncIndexes();
      const creator = req.user._id;
      const body = req.body;
  
      const customBody = {
       jugador: creator,
        jugadorName: req.user.username,
        oro: body.oro,
        salud: body.salud,
        personaje: body.personaje,
        
      };
      try {
        const newRecord = new Record(customBody);
        const saveRecord = await newRecord.save();
         await User.findByIdAndUpdate(
          creator, 
          { $push: { records: saveRecord._id } }
        );
        return res
          .status(saveRecord ? 200 : 404)
          .json(saveRecord ? saveRecord : 'Error en el guardado del record');
        
      } catch (error) {
        return res.status(404).json({
            error: 'Error segundo',
            message: error.message,
          });
      }
     
    } catch (error) {
      return (
        res.status(500).json("Error general")
      )
    }
  };
  //!----------SORT GENERAL DESCENDING --------------

  const sortRecords = async (req, res, next) => {
    try {
      const { filtro } = req.params;
  
      const recordsArray = await Record.find().populate('jugador');
  
      switch (filtro) {
        case 'oro':
          recordsArray.sort((a, b) => {
            if (b.oro === a.oro) {
            
              if (b.salud === a.salud) {
                return b.oro - a.oro; 
              }
              return b.salud - a.salud; 
            }
            return a.oro - b.oro; 
          });
          break;
        case 'personaje':
        case 'salud':
     
          recordsArray.sort((a, b) => {
            return b[filtro] - a[filtro];
          });
          break;
        default:
          return res.status(404).json(
            'La propiedad por la que quiere ordenar no existe/está mal escrita '
          );
      }
  
      return res.status(recordsArray.length > 0 ? 200 : 404).json(
        recordsArray.length > 0
          ? recordsArray.reverse()
          : 'No se han encontrado registros en la DB/BackEnd'
      );
    } catch (error) {
      return res.status(500).json({
        error: 'Error General',
        message: error.message,
      });
    }
  };
  

  module.exports = {
  crearRecord,
  sortRecords
  
  };
  