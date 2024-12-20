const {pool} = require("./connection")
const format = require("pg-format")

const obtenerTotal = async() => {
    const {rows} = await pool.query("SELECT COUNT (*) FROM inventario");
    return parseInt(rows[0].count)
}

const obtenerJoyas = async ({limits = 5, order_by = "id_ASC", page = 1}) => {
    const [campo, direccion] = order_by.split("_");
    const offset = Math.abs((page - 1) * limits ) ;
    const formatted = format("SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset)
    const {rows} = await pool.query(formatted) 
    const total = await obtenerTotal() 
    return HATEOASFormat(rows, total)
}

const filtros = async ({precio_min, precio_max, categoria, metal}) => {
    let filtros = [];
    let values = [];
    const agregar = (campo, comparador, valor) => {
        values.push(valor)
        const { length } = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
        }
    if(precio_min){
        agregar("precio", ">=", precio_min)
    }
    if(precio_max){
        agregar("precio", "<=", precio_max)
    }
    if(categoria){
        agregar("categoria", "=", categoria)
    }
    if(metal){
        agregar("metal", "=", metal)
    }
    let text = "SELECT * FROM inventario";

    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        text += ` WHERE ${filtros}`
        }
    let result = await pool.query(text, values)
    return result.rows 

}

const HATEOASFormat = (array_joyas, total) => {
    const joyas = array_joyas.map((joya) => ({
        name: joya.nombre,
        href: `/joyas/joya/${joya.id}`            
        
    }))
    const resJoyas = {
        "total": total,
        "results": joyas
    }
    return resJoyas
}

module.exports = {obtenerJoyas, filtros, HATEOASFormat}