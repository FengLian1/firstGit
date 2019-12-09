const express = require('express')
const router = express.Router();
const Accounts = require("../models/user");
const bcrypt= require("bcryptjs");
const hasAccess= require("../middleware/auth");

require("dotenv").config({path:'../config/keys.env'});

router.get('/registration', (req, res) =>
{
    res.render("User/registration");
});

router.get('/login', (req, res) =>
{
    res.render("User/login");
});

router.get('/userDashboard',hasAccess ,(req, res) =>
{

    res.render("User/userDashboard");
});

router.get('/adminDashboard', hasAccess, (req, res) =>
{
    res.render("User/adminDashboard");
});


router.post('/login', (req,res) =>
{
    const errors = [];
    const formData = {
        userName : req.body.userName,
        password : req.body.password
    }

    Accounts.findOne({userName:formData.userName})
    .then(user=>{

        //no matching
        if(user==null)
        {
            errors.push("Sorry your username was not found");
            res.render("User/login",{
                login: errors
            })
        }

        else
        {
            bcrypt.compare(formData.password,user.password)
            .then(isMatched=>{

                if(isMatched==true)
                {
                    //It means that the user is authenticated 

                    //Create session 
                    req.session.user=user;

                    if (user.type == 'Admin')
                        res.redirect("/User/adminDashboard");
                    else
                        res.redirect("/User/userDashboard");
                }

                else
                {
                    errors.push("Sorry, your password does not match");
                    res.render("User/login",{
                        login:errors
                    })
                }

            })

            .catch(err=>console.log(`Error :${err}`));
        }
    })
    .catch(err=> console.log(`Something occured ${err}`));

});


router.post('/registration', (req, res) =>
{
    const errors = [];
    //start with uppercase, and only alphabet allowed
    const pattern1 = /^[A-Z][a-zA-Z]+/
    //start with letter, at least 6 character
    const pattern2 = /^[a-zA-Z].{5}/;
    
    if (req.body.userName == "" || !pattern1.test(req.body.userName))
    {
        errors.push("User name must start with uppercase, and only alphabet allowed!!");
    }

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

    if (req.body.password2 == "" || req.body.password2 != req.body.password)
    {
        errors.push("Password does not match!!");
    }

    if (req.body.bdate == "")
    {
        errors.push("Please enter your birthday!!");
    }

    Accounts.findOne({userName:req.body.userName})
    .then(user=>{
        console.log(`DUplicate in${user}`);
        if (user != null)
        {
            //const errors2 = [];
            errors.push("Sorry, Username already exist!");
            //res.render("User/registration",{regis:errors2});
        }
                        
    }).catch((err)=>
    {
        console.log(`Error ${err}`);
    })

    if (errors.length > 0)
    {
        res.render("User/registration", {regis:errors});
    }
    else
    {
        //connect to MongoDB, create schema  
        
        //create account model
        //const Accounts = mongoose.model('Accounts', accountSchema);

        const formData ={
            userName: req.body.userName,
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
                api_key: `${process.env.SENDGRID_API_KEY}`
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
           res.redirect("/User/userDashboard");
    }
});


router.get("/logout",(req,res)=>
{
    //This destorys the session
    req.session.destroy();
    res.redirect("/User/login");
});




module.exports = router;

