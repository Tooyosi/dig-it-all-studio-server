// var express = require('express'),
var restify = require("restify"),
    nodemailer = require("nodemailer"),
    bodyParser = require("body-parser"),
    corsMiddleware = require("restify-cors-middleware");
    
    // require('dotenv').config();
//Middleware Cors
var cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders: ['API-Token'],
    exposeHeaders: ['Api-Token-Expiry']
});


// Server
var server = restify.createServer();
// handle cross-origin problem
server.pre(cors.preflight);
server.use(cors.actual);
// query and bodyparse to use data sent by url
server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use(restify.plugins.bodyParser({
    mapParams: true
}));
server.use(restify.plugins.fullResponse());

// setup email config
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "tuc0476@gmail.com",
        pass: "Conjugate1"
    }
});

server.get("/", function(req, res){
    res.send("Running app");
})

server.get("/success", function(req, res){
    res.send("Mail sent! We'll get back to you shortly ");
})
var result = {"data": ""};
server.post("/api/email", function create(req, res, next){
    // console.log(req.params)
    console.log(req.body)
    var mail = {
        from: req.body.fields.email,
        to: 'tuc0476@gmail.com',
        subject: 'New Mail',
        html: "name: <br />"+ req.body.fields.name + "<br /> Message: <br />"+ req.body.fields.message + "<br />email <br />"+ req.body.fields.email,
    }
    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            result.data ="An error occured, Please Try Again"
            console.log(result);
            console.log(error);
            res.send(JSON.stringify(result)); 
        }else{
            result.data ="Mail sent! We'll get back to you shortly "
            console.log(result);
            console.log("Success")
            res.send(JSON.stringify(result));                        
        }
        smtpTransport.close();
    });

    res.send(201, req.params)
})



server.listen(process.env.PORT, process.env.IP, function(){
    console.log(`app is working on ${process.env.PORT}`)
})