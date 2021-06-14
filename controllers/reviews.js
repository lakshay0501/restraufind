const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.renderReviewForm = async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
  
    // review.rating = parseInt(review.rating);
    // res.send(req.body.review.rating)
  
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save();

    req.flash('Success','Your review is added succesfully Thanks for your rating')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReviewForm = async (req,res) => {
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('Success','Your review is deleted succesfully')
    res.redirect(`/campgrounds/${id}`)
}

