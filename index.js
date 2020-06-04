const express = require('express')
const app = express()

app.use(express.json())

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
    console.log(body)
    const newPerson ={
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(newPerson);
    res.json(persons)
})


const PORT = 3001
app.listen(PORT, () => console.log(`Running server on port ${PORT}`))