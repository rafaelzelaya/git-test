var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require("passport");
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req,res, next) => {
  User.register(new User({username: req.body.username}),
  req.body.password, (err,user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader("content-type","application/json");
      res.json({err: err});
    }
    else{
      passport.authenticate("local")(req,res,()=>{
        res.statusCode = 200;
        res.setHeader("content-type","application/json");
        res.json({success: true, status: "Registration Successful!"});
      });
    }
  })
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  /*res.statusCode = 200;
  res.setHeader("content-type","application/json");
  res.json({success: true, status: "You area Successfully login!"});*/
  var token = authenticate.getToken({_id:req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success:true,token:token,status:'You are successfully logged in!'});
});

router.get("/logout", (req, res)=>{
  if(req.session){
    console.log("entro al if del logout");
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  }
  else{
    console.log("Entro al else del logout");
    var err = new Error("You are not logged in!");
    err.status = 401;
    next(err);
  }
});
module.exports = router;
