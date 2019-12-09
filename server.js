const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const fileupload = require("express-fileupload");
const session = require("express-session");

require("dotenv").config({path:'./config/keys.env'});

//import routes
const userRoutes = require("./routes/User");
const roomRoutes = require("./routes/Room");
const generalRoutes = require("./routes/General");

const app = express();
app.use(fileupload())
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


//app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({secret:"App Session"}))

app.use((req,res,next)=>{

    res.locals.user= req.session.user;
    next();
})

//router object
app.use("/User", userRoutes);
app.use("/Room", roomRoutes);
app.use("/", generalRoutes);

//connect to MongoDB in the cloud
const cstring = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-53fk4.mongodb.net/${process.env.DB_DATABASE_NAME}?retryWrites=true&w=majority`;
mongoose.connect(cstring, {useNewUrlParser: true})
.then(()=>{
    console.log(`Database is connected`)
})
//The catch block will only be executed if the connection failed
.catch(err=>{
    console.log(`Something went wrong : ${err}`);
})




//create a express web server
const PORT = process.env.PORT || 3000;
//const port = 3000;
app.listen(PORT, ()=>
{
    console.log(`web is connect to ${PORT}`);
});
