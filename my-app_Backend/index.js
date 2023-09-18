// mongodb://localhost:27017
const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
connectToMongo();

const app = express()
app.use(cors())
const port = 5000
//available routes 
//app.use for routing files
app.use(express.json()) // need to do this for getting the response from the sever as in json form

//api routing using express
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))


app.listen(port, () => {
  console.log(`iNoteBook app listening on port http://localhost:${port}`)
})