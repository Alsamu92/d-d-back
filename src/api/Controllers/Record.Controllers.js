const Record = require("../models/Record.model");
const User = require("../models/User.model");


const crearRecord = async (req, res, next) => {
  try {
      await Record.syncIndexes();
      const creator = req.user._id;
      const body = req.body;
  
      const customBody = {
       jugador: creator,
        jugadorName: req.user.name,
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

  module.exports = {
  crearRecord,
  
  };