//connect db to mongoose
const mongoose = require('mongoose');
// whenever we want to connect the db to different deployment we just need to chandge the different connection string
const mongoURI = "mongodb://localhost:27017"

// in the learning vedio it is metioned that the connect() accepts a callback but it does not accepts now as per updates in the module.
const connectToMongo = () => {
      mongoose.connect(mongoURI)
      console.log("connected to mongedb")
}

module.exports = connectToMongo;