const loginControl = (request, response) => {
    const clientServices = require('../services/clientServices');
    console.log(request.body);
    let username = request.body.username;
    let password = request.body.passwsord;
    if (!username || !password) {
        console.log("Error in first cond");
        response.send('login failed');
        response.end();
    } else {
        if (request.session && request.session.user) {
            response.send("Already logged in");
            response.end();
        } else {
            clientServices.loginService(username, password, function(err, dberr, client) {
                console.log("Client from login service :" + JSON.stringify(client));
                if (client === null) {
                    console.log("Auhtentication problem!");
                    response.send('login failed'); //invite to register
                    response.end();
                } else {
                    console.log("User from login service :" + client[0].num_client);
                    //add to session
                    request.session.user = username;
                    request.session.num_client = client[0].num_client;
                    if (username == "admin" && password=="adminpassword"){
                        request.session.admin = true;
                    }else{
                        request.session.admin = false;
                    }
                    response.render("logged_in" , {name: username})
                }
            });
        }
    }
};


const registerControl = (request, response) => {
    const clientServices = require('../services/clientServices');
    const { Client } = require('../models/entities');

    let username = request.body.username;
    let password = request.body.passwsord;
    let society = request.body.society;
    let contact = request.body.contact;
    let addres = request.body.addres;
    let zipcode = request.body.zipcode;
    let city = request.body.city;
    let phone = request.body.phone;
    let fax = request.body.fax;
    let max_outstanding = request.body.max_outstanding;
    let client = new Client(username, password, 0, society, contact, addres, zipcode, city, phone, fax, max_outstanding);
    console.log("Password"+client.password);
    clientServices.registerService(client, function(err, exists, insertedID) {
        console.log("User from register service :" + insertedID);
        if (exists) {
            console.log("Username taken!");
            response.send(`registration failed. Username (${username}) already taken!`); //invite to register
        } else {
            client.num_client = insertedID;
            console.log(`Registration (${username}, ${insertedID}) successful!`);
            response.render("Sign_Up_Successfull" , {name: username});
        }
    });
};

const getClients = (request, response) => {
    const clientServices = require('../services/clientServices');
    if (request.session.admin){
        clientServices.searchService(function(err, rows) {
            response.render('clientCatalog', {clientslist:rows})
        });
    }
    else{
        response.send("You dont have admin privileges")
    }
};

const getClientByNumclient = (request, response) => {
    const clientServices = require('../services/clientServices');
    let num_client = request.params.id;
    clientServices.searchNumclientService(num_client, function(err, rows) {
        response.json(rows);
        response.end(); 
    });
};

module.exports = {
    loginControl,
    registerControl,
    getClients,
    getClientByNumclient
};