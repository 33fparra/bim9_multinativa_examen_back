var express =require('express')
var cors = require('cors')

var routes = require('./routes')

var app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(cors())

app.use('/api', routes)

module.exports = app