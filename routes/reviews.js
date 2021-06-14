const express = require('express');
const router = express.Router({mergeParams:true});
const Review = require('../models/review')
const Campground = require('../models/campground')
const Expresserror = require('../utils/Expresserror')
const catchAsync = require('../utils/catchAsync')
const {reviewSchema} = require('../schemas.js')
const{validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')

router.post('/',isLoggedIn,validateReview, catchAsync(reviews.renderReviewForm))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReviewForm))

module.exports = router;