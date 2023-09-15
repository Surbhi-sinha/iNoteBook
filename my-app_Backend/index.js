// mongodb://localhost:27017
const connectToMongo = require('./db');
const express = require('express')
connectToMongo();

const app = express()
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