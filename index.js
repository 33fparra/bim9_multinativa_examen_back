var mongoose = require('mongoose')
var app = require('./src/app.js')

var port = 3001 

mongoose.set('useFindAndModify', false)

mongoose.connect('mongodb://localhost:27017/apilados', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('mongo is connected now')

    app.listen(port, () => {
        console.log('server is running now')
    })
})