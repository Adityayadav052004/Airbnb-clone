const Listing= require("../Models/listing");
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new");
};
module.exports.showListings = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    // ✅ Defensive check if the listing doesn't exist
    if (!listing) {
        console.log("Listing not found for ID:", id); // Debugging log
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};


module.exports.createListing=(async (req,res,next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
});

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");


    res.render("listings/edit.ejs", { listing,originalImageUrl });
};


module.exports.updateListing= async (req, res) => {
    const { id } = req.params;
    console.log("Body received:", req.body);
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
   }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

const Review = require("../Models/review");

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;

    // ✅ First delete the listing and store it
    let deletedListing = await Listing.findByIdAndDelete(id);

    // ✅ Then delete all associated reviews
    await Review.deleteMany({ _id: { $in: deletedListing.reviews } });

    req.flash("success", "Listing and its reviews deleted!");
    res.redirect("/listings");
};
