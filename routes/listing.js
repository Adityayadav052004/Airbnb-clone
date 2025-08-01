const express= require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn, isOwner}=require("../middleware.js");
const listingController= require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});

// Routes
// router.get("/", (req, res) => {
//     res.send("hi i am aditya");
// });

// get route
router.get("/", wrapAsync(listingController.index));


// New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);


// show route
router.get("/:id", wrapAsync(listingController.showListings));


//create route
router.post("/",isLoggedIn,upload.single('listing[image]'), wrapAsync(listingController.createListing));


// edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// update route
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing));


// delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;
