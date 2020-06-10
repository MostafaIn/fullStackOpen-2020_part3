const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( result =>{
    console.log('connected to mongoDB!')
}).catch( err =>{
    console.log('Error connecting to mongoDB:', err.message)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

personSchema.set('toJSON',{
    transform:(document, returnObject) =>{
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)