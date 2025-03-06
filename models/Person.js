const mongoose = require('mongoose')


const uri = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(uri)

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v){
        return /^\d{2,3}-\d{0,9}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number.format: {NN or NNN}-NNN..`
    },
    required: true,
  }
})
phonebookSchema.set('toJSON',{
  transform:(document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const Person = mongoose.model('Person',phonebookSchema)

module.exports = mongoose.model('Person',phonebookSchema)