const express = require("express");
const app = express();
const request = require("request");
const https = require("https");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//for rendering static files 
app.use(express.static("public")); // public is the folder to keep static files

app.get("/", function (req, res) {
    //we can see that the images aren't being loaded-> if u use custom stylesheets even that wont be loaded as they are static files 

    res.sendFile(__dirname + "/signup.html");
});

//to get the data from the form in signup.html 
app.post("/", function (req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    //json objecct which we need to post 
    //the data format is given in the mailchimp docs
    const data =
    {
        members:
            [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields:
                    {
                        FNAME: fname,
                        LNAME: lname
                    }
                }
            ]
    };
    //we now need to stringify the json 
    const jsonData = JSON.stringify(data);
    //now we need to make request -> here we need to make post request 

    const url = "https://us1.api.mailchimp.com/3.0/lists/d658e8a8b5";//add the us1 part and list id 
    //required to make https post requests
    const options = {
        method: "POST",
        auth: "Siddharth:f6635bd4bde569dec24bb0d82074de8b-us1"//username:apikey
    }

    const request1 = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            // response.on("data", function (data1) {
            //     console.log(JSON.parse(data1));
            // })
            // console.log("Success");
            // res.send("Success");
            res.sendFile(__dirname + "/success.html");
        }
        else {
            // console.log("Process failed try again later");
            res.sendFile(__dirname + "/failure.html");
        }

    });
    //this request1 is used to send the json data to mailchimp 
    request1.write(jsonData);
    //when we are done with the request 
    request1.end();

});

//failure route 
app.post("/failure", function(req, res){
    //redirects to the home route
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server has started");
});

//API key : f6635bd4bde569dec24bb0d82074de8b-us1
//list id : d658e8a8b5-> helps to identify the list we need to put subscribers in 
//refer heroku docs under node.js for deployment
