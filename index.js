//?-----------------------TRAER LIBERIAS---------------------------------
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
//?--------------------------------------------------------------------------
//?-----------------------Conectar base de datos---------------------------------

const { conectarBd } = require('./src/utils/db');
conectarBd();
//?--------------------------------------------------------------------------
//?-----------------------Configurar Cloudinary---------------------------------


//?--------------------------------------------------------------------------
//?-----------------------Traer variable de entorno PORT---------------------------------
const PORT = process.env.PORT;

//?-----------------------Crear servidor y darle las Cors---------------------------------
const app = express();
app.use(cors());

//?--------------------------------------------------------------------------
//?-----------------------Ponerle limitaciones---------------------------------

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));

//?-----------------------Crear las rutas---------------------------------
const UserRoutes = require('./src/api/Routes/User.Routes');

app.use('/api/v1/usuario/', UserRoutes);
const RecordRoutes = require('./src/api/Routes/Record.routes');
app.use("/api/v1/record/",RecordRoutes)

//?--------------------------------------------------------------------------
//?-----------------------Poner servidor a funcionar---------------------------------

app.listen(PORT, () => {
  console.log(`Servidor lanzado en el puerto 👌 http://localhost:${PORT}`);
});
