const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//     console.log('give password as argument')
//     process.exit(1)
// }

// const password = process.argv[2]

// const url =
//     `mongodb+srv://deislaurbana:${password}@cluster0.3lhlqan.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

//console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
    content: {  //set some validation to the schema, in order to validate hen they make a post request
        type: String,
        minLength: 5,
        required: true
    }, 
    important: Boolean,
})
//used to return part of the data of the db
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)