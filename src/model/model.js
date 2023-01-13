var mongoose = require('mongoose')
var Schema = mongoose.Schema

var libroSchema = Schema({
    ISBN: String,
    nombreLibro: String,
    autor: String,
    portada: String,
    editorial: String,
    paginas: Number,
    // fechaIngreso: {type: Date, default: Date.now},
    // revisado: {type: Boolean, default: false}
})

module.exports = mongoose.model('Libro', libroSchema)

//este loo modifique 12/01/2023