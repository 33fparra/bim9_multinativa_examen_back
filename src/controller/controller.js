var validator = require('validator')
var Libro = require('../model/model')

var fs = require('fs')
var path = require('path')

var controllers = {

    //guardar nuevo libro
    new: (req, res) =>{
        var params = req.body
        try{
            var ISBNVal = !validator.isEmpty(params.ISBN)
            var nombreLibroVal = !validator.isEmpty(params.nombreLibro)
            var autorVal = !validator.isEmpty(params.autor)
            var editorialVal = !validator.isEmpty(params.editorial)
            var paginasVal = !validator.isEmpty(params.paginas)
            // var emailVal = !validator.isEmpty(params.ISBN)
        }catch(err){
            return res.status(400).send({
                status: 'error',
                message: 'Not enough data'
            })
        }

        if(ISBNVal && nombreLibroVal && autorVal && editorialVal && paginasVal){
            var libro = new Libro()
            libro.ISBN = params.ISBN
            libro.nombreLibro = params.nombreLibro
            libro.autor = params.autor
            libro.editorial = params.editorial
            libro.paginas = params.paginas

            if(params.portada){
                libro.portada = params.portada
            }else{
                libro.portada = null
            }

            libro.save((err, libro)=>{
                if(err || !libro){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Impossible to save data in database'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    libro
                })
            })
        }else{
            return res.status(400).send({
                status: 'error',
                message: 'Data is not valid'
            })
        }
    },

    //modificar
    update: (req, res) => {
        
        var params = req.body;
        var id = params._id;
        var autor = ''+params.autor
        //console.log(id);
        //console.log(params.autor);
        try{
            
            var autorVal = !validator.isEmpty(autor)
           
            var ISBNVal = !validator.isEmpty(params.ISBN)
            var nombreLibroVal = !validator.isEmpty(params.nombreLibro)
            
            var editorialVal = !validator.isEmpty(params.editorial)
            var paginasVal = !validator.isEmpty(params.paginas)
        }catch(err){
            // console.log(err);
            return res.status(400).send({
                status: 'error',
                message: 'Not enough data'
            })
        }

        if(ISBNVal && nombreLibroVal && autorVal && editorialVal && paginasVal){
            Libro.findOneAndUpdate({_id:id}, params, {new:true}, (err, libro)=>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error while updating'
                    })
                }

                if(!libro){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Libro with id: '+id+' not exists'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    libro
                })
            })
        }else{
            return res.status(400).send({
                status: 'error',
                message: 'Error while validating'
            })
        }
    },

    delete: (req, res) => {
        var id = req.params.id
        Libro.findOneAndDelete({_id:id}, (err, libro)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error while deleting'
                })
            }

            if(!libro){
                return res.status(404).send({
                    status: 'error',
                    message: 'Libro with id: '+id+' not found'
                })
            }

            return res.status(200).send({
                status: 'error',
                libro
            })
        })
    },

    getUser: (req, res) =>{
        var id = req.params.id

        if(!id || id == null){
            return res.status(400).send({
                status: 'error',
                message: 'Document _id must be provided'
            })
        }

        Libro.findById(id, (err, libro) => {
            if(err || !libro){
                return res.status(404).send({
                    status: 'error',
                    message: 'Libro with id: '+id+' not found'
                })
            }

            return res.status(200).send({
                status: 'success',
                libro
            })
        })
    },

    getUsers: (req, res) => {
        var query = Libro.find({})
        var getLastUsers = req.params.last

        if(getLastUsers || getLastUsers != undefined){
            query.limit(5)
        }

        query.sort('-_id').exec((err, libros)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Internal server error'
                })
            }

            if(!libros){
                return res.status(404).send({
                    status: 'error',
                    message: 'No libros found in collection'
                })
            }

            return res.status(200).send({
                status: 'error',
                libros
            })
        })
    },

    //buscar fechaIngreo paginas editorial???? la fecha me genera dudas
    search: (req, res) => {
        var search = req.params.search

        Libro.find({
            "$or":[
                // {"ISBN" : {"$regex": search, "$options":"i"}},
                // {"nombreLibro": {"$regex" :search, "$options": "i"}}
                // {"autor" : {"$regex": search, "$options":"i"}},
                {"editorial": {"$regex" :search, "$options": "i"}},
                {"paginas" : {"$regex": search, "$options":"i"}},
                  ]
        })
        .sort([['fechaIngreso', 'descending']])
        .exec((err, libros)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error while looking for documents'
                })
            }

            if(!libros || libros.length<=0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No libros found with: '+search+' criteria'
                })
            }

            return res.status(200).send({
                status: 'success',
                libros
            })
        })
    },

//tengo dudas con el filename debo cambiarlo? a tempFilenombre

    upload: (req, res) => {
        const file = req.file
        var id = req.params.id

        if(!file){
            return res.status(404).send({
                status: 'error',
                message: 'File cannot be empty or file ext is not allowed'
            })
        }

        var tempFilename = file.tempfilename

        if(id){
            Libro.findOneAndUpdate({_id:id}, {portada: tempFilename}, {new:true}, (err, libro)=>{
                if(err || !libro){
                    return res.status(400).send({
                        status: 'error',
                        message: 'Image could not be saved in document with _id: '+id
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    message: 'File upload and libro portada updated successfully!',
                    filename: file.filename,
                    libro: libro
                })
            })
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'File uploaded successfully',
                tempFilename
            })
        }
    },

    //obtener fotos
    getPhoto: (req, res) => {
        var file = req.params.filename
        var pathFile = 'photo/' + file

        if(exists = fs.existsSync(pathFile)){
            return res.sendFile(path.resolve(pathFile))
        }else{
            return res.status(404).send({
                status: 'error',
                message: 'Image with image: '+ file + ' was not found'
            })
        }
    }
}

module.exports = controllers