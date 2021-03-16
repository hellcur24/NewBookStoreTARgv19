const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoConnect = require('./utilities/db').mongoConnect;

const User = require('./models/user');

const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const app = express();

app.set('view engine', ejs);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.use((req, res, next) =>{
    User.findById("604fbae5f1e34d1836a7f64f")
    .then(user =>{
        console.log(user);
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(error => {
        console.log(error);
    });
});

app.use('/admin', adminRouter); ///admin - is a filter
app.use(shopRoutes);

app.use((req, res)=>{
    res.render('404.ejs', {pageTitle: "Page Not Found", path: ''});
    
    //res.status(404).sendFile(path.join(rootDirectory, 'views', '404.html'));
});

/*app.listen(5000, ()=>{
    console.log('Server is running on Port 5000');
});*/

mongoConnect(() => {
    app.listen(3000, ()=>{
        console.log('Server is running on Port 3000');
    });
});