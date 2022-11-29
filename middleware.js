const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const {campgroundSchema, reviewSchema} = require('./schemas');
module.exports.isLoggedIn=(req, res, next)=>{
    // passport contains the details of user in req.user
    //console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo);
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }else{
        next();
    }
}

module.exports.validateCampground = (req, res, next) => {
    // Here Joi is a npm package which is used for server side validation. The below schema is moved to a 'schemas' file.
    // const campgroundSchema = Joi.object({
    //     campground: Joi.object({
    //         title: Joi.string().required(),
    //         price: Joi.number().required().min(0),
    //         image: Joi.string().required(),
    //         location: Joi.string().required(),
    //         description: Joi.string().required()
    //     }).required()
    // })
    const result = campgroundSchema.validate(req.body);
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        // console.log(result);
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/campgrounds/${id}`);
    }else{
        next();
    }

}
module.exports.isReviewAuthor = async (req, res, next)=>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/campgrounds/${id}`);
    }else{
        next();
    }

}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// module.exports = isLoggedIn;