const mongoose = require('mongoose')


const uri = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(uri)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})
phonebookSchema.set('toJSON',{
    transform:(document,returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// const Person = mongoose.model('Person',phonebookSchema)

module.exports = mongoose.model('Person',phonebookSchema)