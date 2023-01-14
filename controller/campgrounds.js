const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const cloudinary = require('cloudinary').v2;

module.exports.campgroundIndex = async (req, res) => {
    const camp = await Campground.find({});
    // console.log(camp);
    res.render('campgrounds/campground', { camp });
}

module.exports.campgroundnewform = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createnewCampground = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    // here we have added server side validation as a middleware named 'validateCampground'

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    
    const newcampground = new Campground(req.body.campground);
    newcampground.geometry = geoData.body.features[0].geometry;
    newcampground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newcampground.author = req.user._id;
    await newcampground.save();
    // console.log(newcampground);
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${newcampground._id}`); //why address is starting with '/' ????
}

module.exports.showcampground = async (req, res) => {
    const { id } = req.params;

// syntax for nested populate

    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    console.log(camp);
    res.render('campgrounds/show', { camp });
}

module.exports.campgroundEditForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);    
    if(!camp){
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { camp });
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.images.push(...imgs);
    await camp.save();

    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        
    }


    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${camp._id}`); //why address is starting with '/' ????
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect(`/campgrounds`);
}