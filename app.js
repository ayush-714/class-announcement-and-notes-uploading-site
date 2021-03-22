const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
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
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/home.html');
})
app.post('/sign', function (req, res) {
    res.sendFile(__dirname + '/sign.html');
})
app.post('/login', function (req, res) {

    console.log(first_time);
    res.sendFile(__dirname + '/login.html');
})

app.post('/after_add', function (req, res) {

    var temp = req.body.subject;
    let temp2 = {
        subj: temp,
        links: [{}]
    }
    sub.push(temp2);
    console.log(sub);


    if (username == "admin") {
        res.render("subjects_page", { allsub: sub });
    } else {
        res.render("Student_subjects_page", { allsub: sub });
    }

})
app.post('/subjects_page', function (req, res) {

    username = req.body.e;
    if (req.body.e == "admin") {
        res.render("subjects_page", { allsub: sub });
    } else {
        res.render("Student_subjects_page", { allsub: sub });
    }

})

app.post('/add_sub', function (req, res) {

    res.sendFile(__dirname + '/add_sub.html');
});

app.post('/link_page', function (req, res) {
    res.render("link_page", { allsub: sub });
});

app.post('/final_page', function (req, res) {
    var temp3 = req.body.linkss;
    var temp = req.body.sub_topicc;
    var temp2 = req.body.text_exist;
    sub[initial_loc].links.push({ temp2, temp3, temp });

    res.render("final", { allsub: sub[initial_loc] });
});

app.get("/subjects/:subName", function (req, res) {
    // var a=0;
    var required = _.lowerCase(req.params.subName);
    for (var i = 0; i < sub.length; i++) {

        if (_.lowerCase(sub[i].subj) === required) {
            console.log(sub[i]);
            initial_loc = i;
            if (username == 'admin') {
                res.render("final", { allsub: sub[i] });
            }
            else {
                res.render("student_final", { allsub: sub[i] });
            }
        }
    }

});



app.listen(process.env.PORT || 3000, function () {
    console.log("Running....");
});
