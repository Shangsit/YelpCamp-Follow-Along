const express = require('express');
const Campground = require('../models/campground');
const { findByIdAndDelete, populate } = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const campController = require('../controller/campgrounds')

const {storage} = require('../cloudinary/index');
const multer = require('multer');
const upload = multer({storage});

const router = express.Router();
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

// A FANCY WAY TO STRUCTURE THE ROUTES (GIVEN IN EXPRESS DOCS)

router.route('/')
    .get(catchAsync(campController.campgroundIndex))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campController.createnewCampground));



router.get('/new', isLoggedIn, campController.campgroundnewform)

router.route('/:id')
    .get(catchAsync(campController.showcampground))
    .put(isLoggedIn, isAuthor,upload.array('image'),validateCampground, catchAsync(campController.updateCampground))
    .delete(isLoggedIn, isAuthor,catchAsync(campController.deleteCampground))


router.get('/:id/edit', isLoggedIn, isAuthor ,catchAsync(campController.campgroundEditForm))

// router.get('/makecampground', catchAsync(async (req, res) => {
//     const camp = new Campground({ title: 'My Yard', description: 'Cheap camping!' });
//     await camp.save();
//     res.send(camp);
// }))



module.exports = router;

