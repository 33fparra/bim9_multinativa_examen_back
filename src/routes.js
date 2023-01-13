var express = require('express')
var controller = require('./controller/controller')
var upload = require('./config/multer_config')
var router = express.Router()
//prueba para ver si me toma el get
router.get('/', (req, res)=>{return res.send('ruta de prueba para que vea el profe')})

router.post('/libro', controller.new)
router.get('/libros/:last?', controller.getUsers)
router.get('/libro/:id', controller.getUser)
router.put('/libro/:id', controller.update)
router.delete('/libro/:id', controller.delete)
router.get('/libro/buscar/:search', controller.search)

router.post('/libro/photo/:id?', upload, controller.upload)
router.get('/libro/photo/:filename', controller.getPhoto)

module.exports = router