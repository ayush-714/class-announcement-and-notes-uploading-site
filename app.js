const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');


    // const client = new MongoClient(uri, {
//     userNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// var popup = require('popups');


let alert = require('alert');  


const userInfo = new Schema({
    _id:  String, // String is shorthand for {type: String}
    First_Name:  String,
    Last_Name:  String,
    Email:  String,
    Password:  String
  });
  const Info= new mongoose.model("sign_in",userInfo);
// async function run() {
//     try {
//         await client.connect();
//         const database = client.db('sign_in');
//         const namePassword = database.collection('name_password');
//         // Query for a movie that has the title 'Back to the Future'
//         //   const query = { id: 'Back to the Future' };
//         // console.log(namePassword);
//         const query = { Email: '' };
//         const movie = await namePassword.findOne(query);
//         console.log(movie);
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);




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
        
        
        //   docUment.save(function(err) {
        //     if (err) {
        //       if (err.name === 'MongoError' && err.code === 11000) {
        //         // Duplicate username
        //         return res.sendFile(__dirname + '/sign.html');
        //       }
        
        //       // Some other error
        //     //   return res.status(500).send(err);
        //     }
        //     res.json({
        //         success: true
        //       });
        // })
        Info.count({ _id: user_id }) 
        .then((count) => { 
          if (count > 0) {
            alert("User Already Exist")
            res.sendFile(__dirname + '/sign.html');
          } else { 
            res.sendFile(__dirname + '/login.html');
          } 
        }); 
        // , function (err, person) {
        //     if (err) {
        //         console.log("1");
        //         docUment.save();
                // res.sendFile(__dirname + '/login.html');
        //     }else{
        //         console.log("0");
        //         res.sendFile(__dirname + '/sign.html');
        //     }
        //     // Prints "Space Ghost is a talk show host".
           
        //   }
        // console.log(Info.find({ _id: user_id }).count());
        // if(Info.find({ _id: user_id }).count()){
        //     res.sendFile(__dirname + '/sign.html');
        // }else{
        //     res.sendFile(__dirname + '/login.html');
        // }
        // async function run() {
        //     try {
        //         await client.connect();
        //         const database = client.db('sign_in');
        //         const query = { _id: user_id }

        //         const namePassword =database.collection('name_password');
        //         var user_names = await namePassword.findOne(  query ).count();
        //         console.log(user_name);
                

        //     } finally {
        //         // Ensures that the client will close when you finish/error
        //         await client.close();
        //     }
        // }
        // run().catch(console.dir);
      
        // if (found == 1) {
        //     res.sendFile(__dirname + '/sign.html');
        // }
        // else {
        //     res.sendFile(__dirname + '/login.html');
        // }
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

    var temp = req.body.subject;
    let temp2 = {
        subj: temp,
        links: [{}]
    }
    sub.push(temp2);
  


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
