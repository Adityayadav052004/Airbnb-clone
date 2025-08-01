const express= require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js"); 
const { isLoggedIn } = require("../middleware.js");
const {isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");


router.post("/",isLoggedIn, wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:id/reviews/:reviewID", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports=router;