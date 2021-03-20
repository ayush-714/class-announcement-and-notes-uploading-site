const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
var _ = require('lodash');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




var first_time=0;
var sub = ["yup", "None"];

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
app.post('/subjects_page', function (req, res) {
    if(first_time == 1){
        var temp=req.body.subject;
        sub.push(temp);
        console.log(sub);
    }
    first_time=1;
    res.render("subjects_page", { allsub: sub });
})

app.post('/add_sub', function (req, res) {
   
    res.sendFile(__dirname + '/add_sub.html');
});

app.get("/subj/:postName",function(req,res){
    // var a=0;
      var required=_.lowerCase(req.params.postName);
    for(var i=0;i<posts.length;i++){
  
      if(_.lowerCase(posts[i].title) === required){
        console.log("Found!!");
          res.render("finnal",{ti: posts[i]});
  
      }
    }
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Running....");
});
