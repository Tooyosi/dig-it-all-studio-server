var express = require('express'),
// var restify = require("restify"),
    nodemailer = require("nodemailer"),
    bodyParser = require("body-parser"),
    corsMiddleware = require("restify-cors-middleware")
    app         = express();
    
    // require('dotenv').config();

var cors = require('cors');
app.use(cors({credentials: true, origin: 'http://localhost:8080'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// setup email config
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.get("/", function(req, res){
    res.send("Running app");
})

app.get("/success", function(req, res){
    res.send("Mail sent! We'll get back to you shortly ");
})
var result = {"data": ""};
app.post("/api/email", function create(req, res, next){
    // console.log(req.params)
    console.log(req.body)
    var mail = {
        from: req.body.email,
        to: 'tuc0476@gmail.com',
        subject: 'New Mail',
        html: "name: <br />"+ req.body.name + "<br /> Message: <br />"+ req.body.message + "<br />email <br />"+ req.body.email,
    }
    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            result.data ="An error occured, Please Try Again"
            console.log(result);
            console.log(error);
            return res.status(400).send(JSON.stringify(result)); 
        }else{
            result.data ="Mail sent! We'll get back to you shortly "
            console.log(result);
            console.log("Success")
            return res.status(200).send(JSON.stringify(result));                        
        }
        smtpTransport.close();
    });

    // return res.status(201).send(req.params)
})



app.listen(process.env.PORT, process.env.IP, function(){
    console.log(`app is working on ${process.env.PORT}`)
})