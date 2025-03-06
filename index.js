
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/Person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


const morgan = require('morgan')
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
console.log()
let phonebook = [
  {
    'id': '1',
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': '2',
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': '3',
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': '4',
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]

app.get('/',(request,response) => {
  response.send('<h1>connected:/</h1>')
})
app.get('/api/persons',(request,response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})
app.get('/api/persons/:id',(request,response,next) => {
  // const id = request.params.id
  // const match = phonebook.find(personInfo => personInfo.id == id)
  // if(match){
  //   response.json(match)
  // }else
  //   response.status(404).end()
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
app.delete('/api/persons/:id',(request,response,next) => {
  const id = request.params.id
  phonebook = phonebook.filter(personInfo => personInfo.id !== id)

  response.status(204).end()

  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

app.get('/info',(request,response) => {


  const date = new Date()
  const formattedDate = date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
  const timeZoneFull = Intl.DateTimeFormat().resolvedOptions().timeZone
  Person.find({})
    .then(persons => {
      response.send(
        `
      <div>
        Phonebook has info for ${persons.length} people
  
        <p>
          ${formattedDate} (${timeZoneFull})
        </p>
      </div>
      `

      )
    })



})
// const generateId = () =>{
//   const maxId = phonebook.length > 0
//   ? Math.max(...phonebook.map(p => Number(p.id)))
//   : 0

//   return String(maxId + 1)
// }
// const namecheck = (name) =>{
//   return Person.find({name: name})
//   .then(match => match?true:false)

// }
app.put('/api/persons/:id',(request,response,next) => {
  // const id = request.params.id
  // const updatedInfo = request.body
  // phonebook = phonebook.map(p => p.id == id?updatedInfo:p)
  // response.json(updatedInfo)
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id,person,
    {
      new:true,
      runValidators: true,
      context: 'query'
    })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})

app.post('/api/persons',(request,response,next) => {
  const body = request.body
  if(!body.name){
    return response.status(400).json({
      error: 'content missing'
    })
  } else if (!body.number){
    return response.status(400).json({
      error: 'number missing'
    })
  }
  //   else if (namecheck(body.name)){
  //     const person = {
  //       name: body.name,
  //       number: body.number,

  //     }
  //     return Person.findOneAndUpdate({name:body.name},person,{new:true})
  //     .then(updatedPerson => {
  //       response.json(updatedPerson)
  //     })
  //     .catch(error => next(error))


  // }

  const personInfo = new Person({
    name: body.name,
    number: body.number,
  })
  personInfo.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => {
    next(error)
  })

})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error ,request,response,next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return response.status(400).send({ error:'malformatted id' })

  } else if (error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
  console.log(`server running on port ${PORT}`)
})