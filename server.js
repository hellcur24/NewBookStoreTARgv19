const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
//const mongoConnect = require('./utilities/db').mongoConnect;
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);



const User = require('./models/user');

const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const app = express();

const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/BookStoreDB',
    collection: 'sessions'
});

app.set('view engine', ejs);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(session({
    secret: 'my super-super secret secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use((req, res, next) =>{
    if(!req.session.user){
        return next();
    }

    User.findById(req.session.user_id)
    .then(user =>{
        console.log(user);
        req.user = user;
        next();
    })
    .catch(error => {
        console.log(error);
    });
});


app.use('/admin', adminRouter); ///admin - is a filter
app.use(shopRoutes);
app.use(authRoutes);

app.use((req, res)=>{
    res.render('404.ejs', {pageTitle: "Page Not Found", path: '', isAuthenticated: req.isLoggedIn});
    
    //res.status(404).sendFile(path.join(rootDirectory, 'views', '404.html'));
});

/*app.listen(5000, ()=>{
    console.log('Server is running on Port 5000');
});

mongoConnect(() => {
    app.listen(3000, ()=>{
        console.log('Server is running on Port 3000');
    });
});*/

mongoose.connect('mongodb://localhost:27017/BookStoreDB', { useUnifiedTopology: true})
.then(result => {
    User.findOne().then(user => {
        if(!user){
            const user = new User({
                name: 'Jhon',
                email: 'jhon@gmail.com',
                cart:{
                    item: []
                }
            });
            user.save();
        }
    });
    app.listen(5000);
})
.catch(error => {
    console.log(error);
});