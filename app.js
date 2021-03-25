const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
let alert = require('alert');
const { Schema } = mongoose;
// 
const mongo_pass='mongodb+srv://Class:ayush123@cluster0.j8pws.mongodb.net/Notes_Uploading_Site';
mongoose.connect(mongo_pass, { useNewUrlParser: true, useUnifiedTopology: true });
var delay=1000;
// mongodb+srv://Class:<password>@cluster0.j8pws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const userInfo = new Schema({
    _id: String, // String is shorthand for {type: String}
    First_Name: String,
    Last_Name: String,
    Email: String,
    Password: String
});
const aNo = new Schema({
    Subj: String,
    Links: [{
        part_link: String,
        part_head: String,
        part_sub: String
    }]
});
const Info = new mongoose.model("sign_ins", userInfo);
const Announce = new mongoose.model("announcement", aNo);

const ejs = require("ejs");
var _ = require('lodash');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


var username = "admin";

var first_time = 0, initial_loc = 0;
let sub = [
    {
        subj: "Null",
        links: [{
            sub_topic: "Topic",
            text_entered: "NA",
            link_exist: "No"
        }]
    }
];
app.post('/submit_signup', function (req, res) {

    var user_name = req.body.f;
    var user_last = req.body.s;
    var user_id = req.body.u;
    var user_email = req.body.e;
    var user_pass = req.body.pass;
    if (user_id == 'admin') {
        res.sendFile(__dirname + '/sign.html');
    }
    else {
        const docUment = new Info({
            _id: user_id,
            First_Name: user_name,
            Last_Name: user_last,
            Email: user_email,
            Password: user_pass
        });
        const found = 0;


        Info.countDocuments({ _id: user_id })
            .then((count) => {
                if (count > 0) {

                    alert("This username is already exist");
                    res.sendFile(__dirname + '/sign.html');
                } else {
                    docUment.save();
                    res.sendFile(__dirname + '/login.html');
                }
            });

    }
});


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/home.html');
})
app.post('/sign', function (req, res) {
    res.sendFile(__dirname + '/sign.html');
})
app.post('/login', function (req, res) {

    res.sendFile(__dirname + '/login.html');
})


app.post('/after_add', function (req, res) {

    const temPdata = new Announce({
        Subj: req.body.subject,
        Links: [{ }]
    });
    temPdata.save();
    setTimeout(function() {
        Announce.find({}, function (err, arr) {
       


            if (username == "admin") {
                res.render("subjects_page", { allsub: arr });
            } else {
                res.render("Student_subjects_page", { allsub: arr });
            }
        });;
    }, delay);
    
})
app.post('/verify', function (req, res) {

    username = req.body.e;
    var array;
    Announce.find({}, function (err, arr) {
        array = arr;

        

        if (req.body.e == "admin" && req.body.pass == "a") {
            res.render("subjects_page", { allsub: arr });
        } else {
            Info.countDocuments({ _id: username, Password: req.body.pass })
                .then((count) => {

                    if (count > 0) {
                        res.render("Student_subjects_page", { allsub: arr });
                    } else {
                        alert("Username or password is incorrect!");
                        res.sendFile(__dirname + '/login.html');
                    }
                });

        }
    });
})
app.post('/go_login', function (req, res) {

    res.sendFile(__dirname + '/login.html');
});
app.post('/go_sign', function (req, res) {

    res.sendFile(__dirname + '/sign.html');
});
app.post('/go_subj', function (req, res) {

    Announce.find({}, function (err, arr) {
    
            res.render("subjects_page", { allsub: arr });
    });
    
});
app.post('/go_stusubj', function (req, res) {
    Announce.find({}, function (err, arr) {
       
        res.render("Student_subjects_page", { allsub: arr });
    });

});



app.post('/add_sub', function (req, res) {

    res.sendFile(__dirname + '/add_sub.html');
});

app.post('/link_page', function (req, res) {
    res.render("link_page", { allsub: sub });
});

app.post('/final_page', function (req, res) {
    var part_link = req.body.linkss;
    var part_head = req.body.sub_topicc;
    var part_sub = req.body.text_exist;
    var all_data;
    Announce.find({}, function (err, arr) {
        var fina=({
            part_head :req.body.sub_topicc,
            part_sub :req.body.text_exist,
            part_link: req.body.linkss
        });
        
        Announce.findOneAndUpdate(
            { Subj: arr[initial_loc].Subj }, 
            { $push: { Links: fina  } },
           function (error, success) {
                 if (error) {
                     console.log(error);
                 } else {
                     console.log(success);
                 }
             });
         
             setTimeout(function() {
                Announce.find({}, function (err, arr) {
                    res.render("final", { allsub: arr[initial_loc] });
                });;
            }, delay);
    
});
});

app.get("/subjects/:subName", function (req, res) {
    // var a=0;

    var required = _.lowerCase(req.params.subName);
    Announce.find({}, function (err, arr) {
        array = arr;


        for (var i = 0; i < arr.length; i++) {

            if (_.lowerCase(arr[i].Subj) === required) {

                initial_loc = i;
                if (username == 'admin') {
                    res.render("final", { allsub: arr[i] });
                }
                else {
                    res.render("student_final", { allsub: arr[i] });
                }
            }
        }
    });
});


app.listen(process.env.PORT || 3000, function () {

});
