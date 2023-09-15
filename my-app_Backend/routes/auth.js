const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken') ;
var fetchuser = require('../middleware/fetchuser');

//in Get() request we pass everything in the URL including all the information thus we use the POST() method to store any data to database

//ROUTE 1 : create a User using : POST "/api/auth/createuser" . Does require a login and  Doesn't require Auth post('route' , validation checks , call back function)
router.post('/createuser',[//error checks using express validator
      body('email','enter valid email').isEmail(), 
      body('name','enter a valid name').isLength({min:3}),
      body('password','password should be min 5 length').isLength({min:3})
], async (req, res) =>{
      
      console.log(req.body);
      // while saving a data to database remember to enter unique values to the value which you make as key for example we have make the email as unique value in the user model

      // if there are errors, return a bad request and the errors
      const errors = validationResult(req);
      if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
      }
      const JWT_SECRET = "surbhi81308"
      //check whether the user exists
      //just for being safe wrap up in try-catch
      try{
            // creating hash via use of bcrypt npm library to safeguard the password
            const salt = await bcrypt.genSalt(10);
            
            //creating a secure password from the current password using the salt in bcrypt
            secPass = await bcrypt.hash(req.body.password,salt)
            
            //crate a new user
            const user =await User.create({
                  name : req.body.name,
                  email:req.body.email,
                  password:secPass
            })
            // jwt jason web token is used foe a token based authentication used for the user to authenticate the login
            data = {
                  user:{
                        id :user.id
                  }
            },
            authToken = jwt.sign(data,JWT_SECRET),
            console.log(authToken),
            res.json(authToken)            
      } catch(error){
            console.log(error.message);
            res.status(500).send("internal server error occured")
      }
      
})


// ROUTE 2: Authenticate a User using : Get "/api/auth/login" . Doesn't require login
router.post('/login',[
      body('email', 'Enter valid email').isEmail(),
      body('password', 'password can not be blank').exists()
], async (req, res) => {
      // if there are errors, return a bad request and the errors
      const errors = validationResult(req);
      if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
      }
      //in ideal situation when there are no errors we will destructure the request and extract the password and email.
      const{email,password} = req.body;
      const JWT_SECRET = "surbhi81308"
      try{
            let user =await User.findOne({email});
            if(!user){
                  return res.status(400).json({error: "please enter correct credentials"});
            }
            const passwordCompare =await bcrypt.compare(password, user.password);
            if(!passwordCompare){
                  return res.status(400).json({error: "please enter correct credentials"});
            }
            data = {
                  user:{
                        id :user.id
                  }
            },
            authToken = jwt.sign(data,JWT_SECRET),
            // console.log(authToken),
            res.json(authToken) 
      }catch(error){
            console.log(error.message);
            res.status(500).send("internal server error occured")
      }
})

// ROUTE 3: Get loogedin  User details  : Get "/api/auth/getuser" .require login

router.post("/getuser",fetchuser,
async (req,res) => {
      try {
            userId = req.user.id;
            const user  = await User.findById(userId).select("-password")
            res.send(user)
      } catch (error) {
            console.log(error.message);
            res.status(500).send("internal server error occured")
      }
})

module.exports = router