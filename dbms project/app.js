//jshint esversion:6
var _ = require('lodash');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "server123",
  database: "mydb"
});
connection.connect((err)=>{
  if(err)
    console.log(err.message);
  console.log(connection.state);
});

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var name;
var username;
arr = [];
price = 0;
var isauth = false;

app.get("/",function(req,res){
  res.render("index",{isauth:isauth,name:name});
})

app.get("/login",function(req,res){
  res.render("login");
})

app.get("/logout",function(req,res){
  connection.query("select * from carts;",(err,result)=>{
    if(err)
      console.log(err);
    else {
      var n = arr.length;
      for(let i=0;i<n;i++){
        var size = result.length;
        var flag = true;
        for(let j=0;j<size;j++){
          if(result[j].username===arr[i].username && result[j].pid===arr[i].pid){
            flag = false;
            break;
          }
        }
        if(flag){
          connection.query("INSERT INTO carts(username,pid,pname,price,category) VALUES('" + arr[i].username + "','" + arr[i].pid + "','" + arr[i].pname + "','" + arr[i].price + "','" + arr[i].category + "')",(err,result)=>{})
        }
      }
      arr = [];
    }
  })
  isauth = false;
  res.redirect("login");
})

app.get("/signup",function(req,res){
  res.render("signup");
})

app.get("/product",function(req,res){
  res.render("product",{isauth:isauth,name:name});
})

app.get("/camera",function(req,res){
  res.render("camera",{isauth:isauth,name:name});
})

app.get("/glasses",function(req,res){
  res.render("glasses",{isauth:isauth,name:name});
})

app.get("/shirt",function(req,res){
  res.render("shirt",{isauth:isauth,name:name});
})

app.get("/shoes",function(req,res){
  res.render("shoes",{isauth:isauth,name:name});
})

app.get("/wallet",function(req,res){
  res.render("wallet",{isauth:isauth,name:name});
})

app.get("/watch",function(req,res){
  res.render("watch",{isauth:isauth,name:name});
})

app.get("/payment",function(req,res){
  res.render("payment",{arr:arr,name:name,price:price});
})

app.get("/success",function(req,res){
  res.render("success");
})

app.get("/cart",function(req,res){
  if(isauth){
    res.render("cart",{arr:arr,price:price});
  }
  else
    res.redirect("/login");
})

app.get("/settings",function(req,res){
  res.render("settings");
})

app.post("/login",function(req,res){
  console.log("first");
  const post = {
          user: req.body.user,
          pass:  req.body.pass
        };
        connection.query("select * from users;",(err,result)=>{
          if(err)
            console.log(err);
          else {
            var flag = false;
            var n = result.length;
            for(let i=0;i<n;i++){
              if(post.user===result[i].username){
                if(post.pass===result[i].password){
                  name = result[i].name;
                  username = result[i].username;
                  flag = true;
                  break;
                }
              }
            }
            if(flag){
              isauth = true;
              arr = [];
              price = 0;
              connection.query("select * from carts;",(err,result)=>{
                if(err)
                  console.log(err);
                else {
                  var n = result.length;
                  for(let i=0;i<n;i++){
                    if(result[i].username===username){
                      arr.push({
                        username : result[i].username,
                        pid : result[i].pid,
                        pname : result[i].pname,
                        price : result[i].price,
                        category : result[i].category
                      });
                      price += arr.at(-1).price;
                    }
                  }
                }
              })
              res.redirect("/");

            }
            else {
              res.redirect("/login");
            }
          }
        })
})

app.post("/signup",function(req,res){
  const details = {
    name: req.body.name,
    user: req.body.user,
    pass: req.body.pass,
    phone: req.body.phone,
    city: req.body.city,
    address: req.body.address
  };
  console.log(details.name + " " + details.user + " " + details.pass + " " + details.phone + " " + details.city + " " + details.address);
  var flag = true;
  connection.query("select * from users;",(err,result)=>{
    if(err)
      console.log(err);
    else {
      var flag = true;
      var n = result.length;
      for(let i=0;i<n;i++){
        if(details.user===result[i].username){
          flag = false;
          break;
        }
      }
      if(flag){
        connection.query("INSERT INTO users(username,password,name,phone,city,address) VALUES('" + details.user + "','" + details.pass + "','" + details.name + "','" + details.phone + "','" + details.city + "','" + details.address + "');",(err,result)=>{
          if(err)
            console.log(err);
          else{
            res.redirect("/login");
          }
        })
      }
      else{
        res.redirect("/signup");
      }
    }
  })

})

app.post("/cart",function(req,res){
  if(isauth){
  const pid = req.body.pid;
  connection.query("select * from products;",(err,result)=>{
    if(err)
      console.log(err);
    else {
      result.forEach((item) => {
        if(item.idproducts===pid){
          arr.push({
            username : username,
            pid : pid,
            pname : item.pname,
            price : item.price,
            category : item.category
          });
          price += arr.at(-1).price;
          console.log(arr.at(-1));
          res.redirect("/"+arr.at(-1).category);
        }
      });
    }
  })
}
else {
  res.redirect("/login");
}
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
