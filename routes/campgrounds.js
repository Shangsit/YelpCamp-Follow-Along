const express = require('express');
const Campground = require('../models/campground');
const { findByIdAndDelete } = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schemas');
const router = express.Router();

const validateCampground = (req, res, next) => {
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
        console.log(result);
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// router.get('/', (req, res) => {
//     res.render('home')
// })

router.get('/', catchAsync(async (req, res) => {
    const camp = await Campground.find({});
    res.render('campgrounds/campground', { camp });
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    // here we have added server side validation as a middleware named 'validateCampground'
    const newcampground = new Campground(req.body.campground);
    await newcampground.save();
    res.redirect(`/campgrounds/${newcampground._id}`); //why address is starting with '/' ????
    console.log("successfully posted!!");
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { camp });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp });
}))

router.get('/makecampground', catchAsync(async (req, res) => {
    const camp = new Campground({ title: 'My Yard', description: 'Cheap camping!' });
    await camp.save();
    res.send(camp);
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect(`/campgrounds/${camp._id}`); //why address is starting with '/' ????
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}))

module.exports = router;