const express= require("express");
const router=express.Router();
const User=require("../Models/user.js");
const Wrapasync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}= require("../middleware.js");
const userController=require("../controllers/users.js");


router.get("/signup",userController.renderSignupForm);

router.post("/signup",Wrapasync(userController.signup));

router.get("/login",userController.renderLoginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local", { failureRedirect: '/login',failureFlash:true}),userController.login);

router.get("/logout",userController.logout);


module.exports= router;