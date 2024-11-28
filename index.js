require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app=express()
const Note = require('./Models/note')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const requestLogger=(request, response, next) =>{
    console.log('Method', request.method);
    console.log('Path', request.path);
    console.log('Body', request.body);
    console.log('---');
    next()
}

app.use(requestLogger)

let notes = []

app.get('/',(request,response) => {
    response.send('<h1>API REST FROM NOTES</h1>')
})
//Regresa todos
app.get('/api/notes',(request,response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})
//Buscar uno solo
app.get('/api/notes/:id',(request,response) => {
    const id = Number(request.params.id)
    //console.log('id:', id);
    const note = notes.find(n => n.id===id)
    //console.log(note);
    if (note) {
        response.json(note)
    }
    else {
        response.status(404).end()
    }
})
//Borrar uno
app.delete('/api/notes/:id',(request,response) => {
    const id = Number(request.params.id)
    //console.log('Delete id:', id);
    notes=notes.filter(n => n.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n=>n.id))
        : 0
    return maxId+1
}

//Agregar uno
app.post('/api/notes',(request,response) => {
    const body = request.body
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const note = {
        id: generateId(),
        content: body.content,
        important: Boolean(body.important) || false
    }
    notes=notes.concat(note)
    response.json(note)
})

app.put('/api/notes/:id',(request,response) => {
    const id = Number(request.params.id)
    const body = request.body
    const note = notes.find(n => n.id === id)
    if (!note) return response.status(404).end()
    const updateNote ={...note,important:body.important}
    notes=notes.map(n => n.id!==id?n : updateNote)
    response.json(updateNote)
})

const PORT= process.env.PORT
app.listen(PORT, ()=> {
    console.log(`Server express running on port ${PORT}`);
})