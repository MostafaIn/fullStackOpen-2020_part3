require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// app.use(morgan('tiny'))
app.use(morgan((token, req, res)=> {
    const {name, number} = req.body;
    return [
        token.method(req, res),
        token.url(req, res),
        token.status(req, res),
        token.res(req, res, "content-length"),
        "-",
        token["response-time"](req, res),
        "ms",
        JSON.stringify({name, number})
    ].join(' ');
})
);

app.get('/api/persons', (req, res) =>{
    Person.find({}).then(persons => {
        res.json(persons)
    })
});

app.get("/info", (req, res) => {
    Person.find({}).then( persons =>{
        let count = persons.map(person =>person.toJSON()).length
        res.send(`
        <div>
        <h3>Phonebook has info for ${count} people</h3>
        <h4>${new Date()}</h4>
        </div>
        `);
    })
});

app.get("/api/persons/:id", (req,res, next) =>{
    Person.findById(req.params.id)
    .then( person =>{
        if(person){
            res.json(person)
        }else{
            res.status(404).end()
        }
    })
    .catch( err => next(err))
});

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then( result =>{
            res.status(204).end()
        })
        .catch( err => next(err))
});

// const generateId = () =>{
//     return Math.floor(Math.random()*0x10000)
// }

app.post("/api/persons", (req, res) =>{
    const body = req.body;
    // console.log(body)
    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }

    const person =new Person({
        name: body.name,
        number: body.number
    })

    person.save().then( savedPerson =>{
        res.json(savedPerson)
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
};
  
app.use(unknownEndpoint)
  
const errorHandler = (err, req, res, next) => {
    // console.error(err.message)
    if (err.name === 'CastError' && err.kind == 'ObjectId') {
      return res.status(400).send({ error: 'malformatted id' })
    } 
    next(err)
};
  
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Running server on port ${PORT}`))