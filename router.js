const e = require("express")
var express = require("express")
var router = express.Router();

//change this with a database for added security
const credentials = {
    email: "user123@gmail.com",
    password: "p"
}
var credential = new Map();
credential.set("u@gmail.com","p")
credential.set("r@gmail.com","f")

//login user
router.post("/login",(req,res) => {
    // if(req.body.email==credentials.email && req.body.password ==credentials.password) {
    //     req.session.user = req.body.email;
    //     res.redirect("/route/dashboard"); 
    //     console.log("The user" +req.session.user+ "has logged in")
    if(credential.has(req.body.email) && req.body.password ==credential.get(req.body.email)) {
        req.session.user = req.body.email;
        res.redirect("/route/dashboard"); 
        console.log("The user " +req.session.user+ " has logged in")
    } else {
        //res.redirect("/")
        // res.render("base", {title: "Express", logout:"Login Unsuccessful"})
        res.send("Unathorized User")
    }
})
router.get("/dashboard", (req,res)=> {
    if(req.session.user) {
        res.render('dashboard', {user: req.session.user})
        console.log("The user " +req.session.user+ " has been directed to the login page")
    } else {
        res.send("Unathorized User")
    }
})

router.get("/rooms", (req,res)=> {
    if(req.session.user) {
        res.render('loopingrooms', {user: req.session.user})
        console.log("The user " +req.session.user+ " has been directed to the rooms page")
    } else {
        res.send("Unathorized User")
    }
})


router.get("/logout", (req,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error")
        } else {
            res.render("base", {title: "Express", logout:"Logout Successful"})
        }
        console.log("The user " +req.session.user+ " has been directed to the rooms page")
    })
})

router.get("/rooms/soccer", (req,res)=> {
    if(req.session.user) {
        res.render('selectuser')
        console.log("The user " +req.session.user+ " has been directed to the rooms page")
    } else {
        res.send("Unathorized User")
    }
})


module.exports = router 