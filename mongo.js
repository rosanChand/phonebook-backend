const mongoose = require('mongoose')

if (process.argv.length < 3){
  console.log('input password as argument')
  process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://rosanchand1234:${password}@cluster0.ys84v.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(uri)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person',phonebookSchema)

const personInfo = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

if (process.argv.length === 3){
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(p => console.log(`${p.name} ${p.number}`))
      mongoose.connection.close()
    })
}else{
  personInfo.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

