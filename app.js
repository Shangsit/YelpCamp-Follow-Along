if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
} 


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { findByIdAndDelete } = require('./models/campground');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('./schemas');
const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const user = require('./models/user');
const passport = require('passport');
const localStrategy = require('passport-local');

const userRoutes = require('./routes/user');
const camproutes = require('./routes/campgrounds');
const reviewroutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {

    // I do not know why the following lines are giving error??
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express()

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionconfig = {
    httpOnly: true,
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionconfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

// serializeUser, deserializeUser, register all came from passportLocalMongoose
passport.serializeUser(user.serializeUser()); //this will define how to put a user into the session
passport.deserializeUser(user.deserializeUser()); //this will define how to take a user out of the session

app.use((req, res, next)=>{
    // here we are creating a local variable under 'success', which will store the value under the key 'success' and it will be available to all the templates
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', camproutes);
app.use('/campgrounds/:id/review', reviewroutes);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong!";
    }
    res.status(statusCode).render('error', { err });
})

app.listen('3000', () => {
    console.log('Server running at port 3000')
})