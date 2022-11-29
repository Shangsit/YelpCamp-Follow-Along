const express = require('express');
const methodOverride = require('method-override');
const Campground = require('../models/campground');
const { findByIdAndDelete } = require('../models/campground');
const ejsMate = require('ejs-mate');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviewController = require('../controller/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor,catchAsync(reviewController.deleteReview))

module.exports = router;