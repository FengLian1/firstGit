const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//app.use(bodyParser.urlencoded({extended: false}));


//routes
app.get('/',(req, res) =>
{
    res.render("home");
});

app.get('/registration', (req, res) =>
{
    res.render("registration");
});

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
