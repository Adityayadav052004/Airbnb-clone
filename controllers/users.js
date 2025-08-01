const User=require("../Models/user");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup= async(req,res)=>{
    try{
         // to extract information from form
        let{username,email,password}=req.body;
    const newUser= new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","Welcome to Lodigify private Limited");
         res.redirect("/listings");
    })

    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
   
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req,res)=>{
   req.flash("Success","Welcome back to Lodgify Private Limited!");
   let redirectUrl=res.locals.redirect || "/listings";
   res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};