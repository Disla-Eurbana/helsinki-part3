//const http = require('http') //changed with express
require('dotenv').config() //file that contains sensitive info, also put this file in gitignored to not upload to github
const express = require('express')
const cors = require('cors')
const Note = require('./models/note')

const app = express()

app.use(express.static('dist')) //to include the frontend code that is in the dist file
//whenever express gets an HTTP GET request it will first check if the dist directory contains a file corresponding to the request's address. If a correct file is found, express will return it.
app.use(express.json()) //to access the date easily when posting new note to server
//Without the json-parser, the body property would be undefined

app.use(cors()) //makes it posible to access the backend from other origin
//if this isnt set, you can only access the backend if it is hosted with the same origin
//for example now backend runs on localhost:3001 and the forntend on vital localhost:5173 -> which is not the same origin

// let notes = [
//     {
//         id: 1,
//         content: "HTML is easyy",
//         important: true
//     },
//     {
//         id: 2,
//         content: "Browser can execute only JavaScript",
//         important: false
//     },
//     {
//         id: 3,
//         content: "GET and POST are the most important methods of HTTP protocol",
//         important: true
//     }
// ]

//creating notes
// const note = new Note({
//   content: 'CSS is Easy',
//   important: false,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// Note.find({}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })
//only the important notes
// Note.find({ important: true }).then(result => {
//     // ...
// })


//part used with http
// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
// })

app.get('/', (request, response) => {
    response.send(('<h1>Hello World</h1>'))
})

app.get('/api/notes', (request, response) => {
    //response.json(notes)
    Note.find({})
        .then(result => {
            response.json(result)
        })
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    //console.log(id)
    const note = notes.find(note => {
        //console.log(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
    })
    //console.log(note)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
