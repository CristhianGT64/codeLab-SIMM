import dotenv from "dotenv";
import express, { request } from "express";

dotenv.config();

/* Crear instancia de express */

const app = express();
const port = process.env.PORT

app.get("/", (req, res)=>{
    res.send('<h1>Hola mundo</h1>')
});

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});