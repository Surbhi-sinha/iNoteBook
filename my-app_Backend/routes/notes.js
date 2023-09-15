const express = require('express');
const router = express.Router();
const Notes = require('../models/Note'); //fetching the Notes model from the models
var fetchuser = require('../middleware/fetchuser'); // fetching the user from the middle ware
const {body, validationResult } = require('express-validator'); //using validator for the validation of input value



// this API will fetch all the notes from the database of the user who is already logged in
// ROUTE 1 : GET all the notes using GET: "api/notes/fetachallnotes". LOGIN REQUIRED
router.get('/fetchallnotes', fetchuser , async (req, res) =>{
      try { 
            const notes = await Notes.find({user : req.user.id})
            res.json(notes);      
      } catch (error) {
            console.log(error.message);
            res.status(500).send("internal server error");
      }
      
})  

// ROUTE 2 : POST add a new note using [POST]: "api/notes/addnote". LOGIN REQUIRED
// (url, fetchuser for fetching the user details so that only the user can see and create its own notes , validation checks , call back func)
router.post('/addnote',fetchuser, [
      body('title','enter at least 5 character').isLength({min:5}), 
      body('description','enter at least 5 character').isLength({min:5})
] , async (req, res) => {
      
      try {
            // data abstraction using the destructuring method;
            const {title , description , tag} = req.body; 

            // errors validation
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                  return res.status(400).json({errors:errors.array()});
            }

            const note = new Notes({
                   title, description,tag ,user:req.user.id
            })
            const savedNote = await note.save();
            res.json(savedNote);      
      } catch (error) {
            console.log(error.message);
            res.status(500).send('internal server error');
      }
      
})

// ROUTE 3 : Update an existing note using [PUT]: "api/notes/updatenote". LOGIN REQUIRED

router.put('/updatenote/:id',fetchuser , async (req,res) => {
      
      try {
            const {title , description , tag } = req.body;
            // create a new note 
            const newNote = {}
            if(title){newNote.title = title};
            if(description){newNote.description = description};
            if(tag){newNote.tag = tag};

            // find the node to be updated

            // check the user 
            let note = await Notes.findById(req.params.id); //id is coming from url
            if(!note){return res.status(404).send("not found")}
            if(note.user.toString() != req.user.id){return res.status(401).send("not allowed")}

            note  = await Notes.findByIdAndUpdate(req.params.id , {$set : newNote} , {new : true}) // find and update the note

            res.send({note})
      } catch (error) {
            console.log(error.message);
            res.status(500).send('internal server error');
      }
      
 })


//  ROUTE 4 : delete a note using DELETE LOGIN REQUIRED
router.delete('/deletenote/:id',fetchuser , async (req,res) => {
      try {
            const {title , description , tag } = req.body;
            // create a new note 
            let newNote = {}
            if(title){newNote.title = title};
            if(description){newNote.description = description};
            if(tag){newNote.tag = tag};

            // find the node to be deleted
            // check the user if it owns the node 
            let note = await Notes.findById(req.params.id); //id is coming from url
            if(!note){res.status(404).send("not found")}
            // check the user if it owns the node 
            if(note.user.toString() != req.user.id){res.status(401).send("not allowed")}

            note  = await Notes.findByIdAndDelete(req.params.id , {$set : newNote} , {new : true}) // find and update the note

            res.send({"success" : "note deleted" , note :note})
      } catch (error) {
            console.log(error.message);
            res.status(500).send('internal server error');
      }
      
 })
module.exports = router