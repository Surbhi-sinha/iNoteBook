//the name of the model should be started from the capital letter

// first of all some info about models .
// so basically in model basically for designing the schema of the data in database (https://mongoosejs.com/docs/guide.html)
const mongoose = require('mongoose');
const { Schema } = mongoose;

// we need to associate the user with the notes so that we could know about the that notes refrenced to the perticular user.
// somewhat here user is similar to the "foreign key" in the SQL wit the type specified as below and ref is given to the value we need to associate
const NotesSchema = new Schema({
  user:{
    type : mongoose.Schema.Types.ObjectId,// an object of another schema 
    ref: 'user'
  },
  title:{
      type: 'string',
      required: true
  }, // String is shorthand for {type: String}
  description:{
      type: 'string',
      required: true
  },
  tag:{
      type: 'string',
      default:"General"
  } ,
  date: { 
      type: Date,
      default: Date.now 
  },
  
});
// model exprts model(name,schema)
module.exports = mongoose.model('notes', NotesSchema);