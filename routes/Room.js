const express = require('express')
const router = express.Router();
const Room = require("../models/Room");
const hasAccess= require("../middleware/auth");
const path = require("path");

router.get("/room_listing",(req,res)=>
{
    Room.find()
    .then((rooms)=>{
        res.render("Room/room_listing",
        {
            lists:rooms
        });
    })
    .catch(err=>console.log(`Error : ${err}`));
    
});

//search for room
router.post("/search",(req,res)=>
{
    Room.find({location:req.body.where})
    .then((rooms)=>{
        res.render("Room/searchRoom",
        {
            lists:rooms
        });
    })
    .catch(err=>console.log(`Error : ${err}`));
    
});

router.get("/add",hasAccess,(req,res)=>
{
    res.render("Room/addRoom");
});

//process submited add room
router.post("/add",hasAccess,(req,res)=>
{
    const errors = [];
    const newRoom =
    {
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        location:req.body.location,
    }

     //Test to see if user upload file
     if(req.files==null)
     {
         errors.push("Sorry you must upload a file");
     }   
 
     //User uploaded file
     else
     {       //file is not an image
             if(req.files.photo.mimetype.indexOf("image")==-1)
             {
                 errors.push("Sorry you can only upload images : Example (jpg,gif, png) ")
             }
     }

     if(errors.length > 0)
    {
        res.render("Room/addRoom",{
            errors:errors,
            title :newRoom.title,
            price : newRoom.price,
            description : newRoom.description,
            location : newRoom.location
        })
    }

    else 
    {

        //insert into database
    const room = new Room(newRoom)
    room.save()
    .then(()=>
    {
        //rename file to include the userid
        req.files.photo.name = `db_${room._id}${path.parse(req.files.photo.name).ext}`;
            
        //upload file to server
        req.files.photo.mv(`public/uploads/${req.files.photo.name}`)
        .then(()=>{

            //Then is needed to refer to associate the uploaded image to the user
            Room.findByIdAndUpdate(room._id,{
                photo:req.files.photo.name 
            })
            .then(()=>{
                console.log(`File name was updated in the database`)
                res.redirect("User/adminDashboard");  
            })
            .catch(err=>console.log(`Error :${err}`));
        });
        console.log(`Room was added to the database`);
        res.redirect("/Room/list");
    })
    .catch(err=>console.log(`Error : ${err}`));
    }

});

////Route to fetch room
router.get("/list",hasAccess,(req,res)=>
{
    Room.find()
    .then((rooms)=>{
        res.render("Room/listRoom",
        {
            lists:rooms
        });
    })
    .catch(err=>console.log(`Error : ${err}`));
});

//Route to direct to edit room
router.get("/edit/:id",hasAccess,(req,res)=>
{
    Room.findById(req.params.id)
    .then((room)=>{

        res.render("Room/editRoom",{
            Room: room
        })

    })
    .catch(err=>console.log(`Error : ${err}`));
});

//Route to process edit form
router.put("/edit/:id",hasAccess,(req,res)=>
{
    Room.findById(req.params.id)
    .then((room)=>{

        room.title=req.body.title;
        room.price=req.body.price;
        room.description=req.body.description;
        room.location=req.body.location;
        
        room.save()

        .then(()=>{
           res.redirect("/Room/list") 
        })
        .catch(err=>console.log(`Error : ${err}`));

    })
    .catch(err=>console.log(`Error : ${err}`));  
});


module.exports = router;