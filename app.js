const express = require('express');
const session = require('express-session');

//creating app
const app = express();
// using JSON and URL Encoded middleware 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
//send an HTTP response when receiving HTTP GET /
app.use(express.static('public'));
app.use(session({secret: 'passwsord'}));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index'); //no need for ejs extension
});
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname});
});
//route for contacts
app.get('/contacts', (req, res) => {
    res.render('contacts'); 
});
app.get('/register', (req, res) => {
    res.render('register'); 
});
app.get('/login', (req, res) => {
    res.render('login'); 
});
app.get('/clientCatalog', (req, res) => {
    res.render('clientCatalog'); 
});
//make the app listen on port 
const port = process.argv[2] || process.env.PORT || 3000;
const server = app.listen(port, () => {
 console.log(`Cart app listening at http://localhost:${port}`);
});



//pass requests to the router middleware
const router = require('./routes/apis');
app.use(router);  

