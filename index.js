const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

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

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
];

app.get('/api/persons', (req, res) =>{
    res.json(persons)
});

app.get("/info", (req, res) => {
    res.send(`
    <div>
    <h3>Phonebook has info for ${persons.length} people</h3>
    <h4>${new Date()}</h4>
    </div>
    `);
});

app.get("/api/persons/:id", (req,res) =>{
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id);
    person ? res.json(person) : res.status(404).json({error: `id:${id} does not exist in the list.`});
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

const generateId = () =>{
    return Math.floor(Math.random()*0x10000)
}

app.post("/api/persons", (req, res) =>{
    const body = req.body;
    // console.log(body)
    const newPerson ={
        name: body.name,
        number: body.number,
        id: generateId()
    }
    const existedPerson = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase());

        if (!body.name || !body.number){
            return res.status(400).json({ error: "name or number is missing" });
        }else if(existedPerson){
            return res.status(400).json({ error: "name must be unique" });
        }else{
            persons = [newPerson, ...persons]
            return res.json(persons);
        }
})


const PORT = 3001
app.listen(PORT, () => console.log(`Running server on port ${PORT}`))