//the name of the model should be started from the capital letter

// first of all some info about models .
// so basically in model basically for designing the schema of the data in database (https://mongoosejs.com/docs/guide.html)
const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
  name:{
      type: 'string',
      required: true
  }, // String is shorthand for {type: String}
  email:{
      type: 'string',
      required: true,
      unique: true
  },
  password:{
      type: 'string',
      required: true
  } ,
  date: { type: Date, default: Date.now },
  
});
// model exprts model(name,schema)
module.exports = mongoose.model('user', UserSchema);
