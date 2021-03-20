const express=require("express");
const body_=require("body-parser");
const request=require("request");
const app=express();
app.get('/',function(req,res){
    res.sendFile(__dirname+'/home.html');
})
app.post('/sign',function(req,res){
    res.sendFile(__dirname+'/sign.html');
})
app.post('/login',function(req,res){
    res.sendFile(__dirname+'/login.html');
})
app.post('/final',function(req,res){
    res.sendFile(__dirname+'/final.html');
})
app.listen(process.env.PORT || 3000,function(){
    console.log("Running....");
    })
    