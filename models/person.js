const mongoose = require('mongoose')
const uniqValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then( result =>{
    console.log('connected to mongoDB!')
}).catch( err =>{
    console.log('Error connecting to mongoDB:', err.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true,
        required: true,
        validate: (v)=>{
            return /^[A-Za-z]+$/.test(v)
        }
    },
    number:{
        type: Number,
        min:8,
        required: true,
        validate:{
            validator: (v)=>{
                return /\d{8}/.test(v)
            }
        }
    }
})

personSchema.plugin(uniqValidator)

personSchema.set('toJSON',{
    transform:(document, returnObject) =>{
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)