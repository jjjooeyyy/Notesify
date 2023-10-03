const Note = require('../models/Notes');
const mongoose = require('mongoose');

// GET Dashboard
exports.dashboard = async(req,res)=> {

    const locals = {
        title: "Dashboard",
        description: "Free Notes App"
    }

    try {
     const notes = await Note.find({}); 

      res.render('dashboard/index.ejs',{
        userName:req.user.firstName,
        locals,
        notes,
        layout:'../views/layouts/dashboard'})

    } catch(error){
      console.log(error);
    }



}
