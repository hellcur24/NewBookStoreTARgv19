const User= require('../models/user');

exports.getLogin = (req, res) =>{
    res.render('auth/login.ejs', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
}

exports.postLogin = (req, res) => {
    User.findById("605632633c615a02d85b6350")
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(()=>{
            res.redirect('/');
        });
    })
    .catch(error =>{
        console.log(error);
    });
}
exports.postLogout = (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/');
    });
}