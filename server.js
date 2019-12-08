const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(express.static('public'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: false }));

//connect to MongoDB in the cloud
const cstring = "mongodb+srv://flian2:test4@cluster0-53fk4.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(cstring, {useNewUrlParser: true})
.then(()=>{
    console.log(`Database is connected`)
})
//The catch block will only be executed if the connection failed
.catch(err=>{
    console.log(`Something went wrong : ${err}`);
})

//routes
app.get('/',(req, res) =>
{
    res.render("home");
});

app.get('/registration', (req, res) =>
{
    res.render("registration");
});

app.get('/login', (req, res) =>
{
    res.render("login"); 
});

app.post('/login', (req,res) =>
{
    const errors = [];
    if (req.body.username == "")
    {
        errors.push("Please enter your username!!");
    }

    if (req.body.password == "")
    {
        errors.push("Please enter your password!!");
    }

    if (errors.length > 0)
    {
        res.render("login",{login:errors})
    }
    //There are no errors
    else
    {
        
    }
})

app.post('/registration', (req, res) =>
{
    const errors = [];
    //start with uppercase, and only alphabet allowed
    const pattern1 = /^[A-Z][a-zA-Z]+/
    //start with letter, at least 6 character
    const pattern2 = /^[a-zA-Z].{5}/;
    
    if (req.body.email == "")
    {
        errors.push("Please enter your email!!");
    }

    if (req.body.first == "" || !pattern1.test(req.body.first))
    {
        errors.push("First name must start with uppercase, and only alphabet allowed!!");
    }

    if (req.body.last == "" || !pattern1.test(req.body.last))
    {
        errors.push("Last name must start with uppercase, and only alphabet allowed!!");
    }

    if (req.body.password == "" || !pattern2.test(req.body.password))
    {
        errors.push("Password must start with letter, at least 6 character!!");
    }

    if (req.body.bdate == "")
    {
        errors.push("Please enter your birthday!!");
    }


    if (errors.length > 0)
    {
        res.render("registration", {regis:errors})
    }
    else
    {
        //connect to MongoDB, create schema
        const Schema = mongoose.Schema;
        const accountSchema = new Schema({
            email: String,
            first: String,
            last: String,
            password: String,
            date: String
        });
        
        //create account model
        const Accounts = mongoose.model('Accounts', accountSchema);

        const formData ={
            email: req.body.email,
            first: req.body.first,
            last: req.body.last,
            password: req.body.password,
            date: req.body.bdate,
        }

        //create account document
        const ac = new Accounts(formData);
        ac.save()
        .then(() =>
        {
            console.log(`Account inserted to database`);
        })
        .catch((err)=>
        {
            console.log(`Account not inserted ${err}`);
        })

        //send Email
        const nodemailer = require('nodemailer');
        const sgTransport = require('nodemailer-sendgrid-transport');

         const options = {
            auth: 
            {
                api_key: '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'
            }
        }

        const mailer = nodemailer.createTransport(sgTransport(options));

        const email = {
            to: `${req.body.email}`,
            from: 'flian2@myseneca.ca',
            subject: 'Welcome',
            text: `Welcome to AirB&B`,
            html: `Welcome to AirB&B`
        };
         
        mailer.sendMail(email, (err, res)=> {
            if (err) { 
                console.log(err) 
            }
            console.log(res);
        });

         //REDIRECT THE USER TO THE DASHBOARD ROUTE
           res.redirect("/room_listing");
    }
})

app.get("/room_listing",(req,res)=>
{
    res.render("room_listing");
});

//create a express web server
const PORT = process.env.PORT || 3000;
//const port = 3000;
app.listen(PORT, ()=>
{
    console.log(`web is connect to ${PORT}`);
});
