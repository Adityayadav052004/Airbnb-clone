if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./Models/review.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash"); 
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User = require("./Models/user.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const dbUrl=process.env.ATLASDB_URL;

// DB connection function
async function main() {
    await mongoose.connect(dbUrl);
}

// Set view engine and paths
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
// to use static files 
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret : process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR in Mongo session store",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};
// Routes
// app.get("/", (req, res) => {
//     res.send("hi i am aditya");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser= new User({
//         email:"Adityakumar0520042454@gmail.com",
//         username:"Victor"
//     });

//     let registeredUser=await User.register(fakeUser,"helloworld"); 
//     res.send(registeredUser);
// })


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// post review route


// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);

});

// 🔥 CRITICAL PART: Connect to DB then start server
main()
    .then(() => {
        console.log("connected to DB");

        app.listen(8080, () => {
            console.log("server is listening on port 8080");
        });
    })
    .catch((err) => {
        console.error("DB connection error:", err);
    });
