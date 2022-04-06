// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const port = process.env.PORT || 3000;

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


app.get("/", (req,res) => {
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", (req,res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/ef65c2cb1d";
    const options = {
        method: "POST",
        auth: "apiKey:a1628bdfdbabb48068345626d6505dfb0-us14"
    };


    const request = https.request(url, options, (response) => {
        
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

    });

    request.write(jsonData);
    request.end();

});


app.post("/failure", (req,res) => {
    res.redirect("/");
});


app.listen(port, () => {
    console.log("Server is running on port " + port);
});


