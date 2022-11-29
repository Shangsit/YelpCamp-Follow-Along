const User = require('../models/user');

module.exports.renderUserRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            else {
                req.flash('success', 'Welcome to Yelp-Camp!!');
                res.redirect('/campgrounds');
            }
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderUserLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = async (req, res) => {
    if (req.session.returnTo) {
        req.flash('success', 'Welcome Back!');
        const returnUrl = req.session.returnTo; //this code worked when I put KeepSessionInfo: true
        res.redirect(returnUrl);
    } else {
        res.redirect('/campgrounds');
    }
    // const returnUrl = req.session.returnTo || '/campgrounds';
    // console.log(returnUrl);
    // res.redirect(returnUrl);

}

module.exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!!!');
        res.redirect('/campgrounds');
    });
}