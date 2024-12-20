const express = require("express");
const { obtenerJoyas, filtros, HATEOASFormat } = require("./consultas")
const app = express();

app.listen(8080, console.log("Server en puerto 8080"))

app.get("/joyas", async (req, res) => {
    try {
        const consulta = await obtenerJoyas(req.query)
        res.status(200).json( consulta)
    } catch (error) {
        res.send(error)
    }
})

app.get("/joyas/filtros", async (req, res) => {
    try {
        const consulta = await filtros(req.query)
        res.status(200).json({ consulta })
    } catch (error) {
        res.send(error)
    }
})