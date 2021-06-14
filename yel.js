if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
    // console.log(process.env.DB_URL);
}

// console.log(process.env.SECRET)
// console.log(process.env.API_KEY)

const express = require('express');
const app = express();
const path = require('path');
const Joi = require('joi');
const {campgroundSchema,reviewSchema} = require('./schemas.js')
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Review = require('./models/review')
const Campground = require('./models/campground')
const Expresserror = require('./utils/Expresserror')
const catchAsync = require('./utils/catchAsync')
const session = require('express-session')
const flash = require('connect-flash')
const helmet = require('helmet')
const mongoSanititze = require('express-mongo-sanitize');

const passport = require('passport')
const localPassport = require('passport-local')
const User = require('./models/user')

const UserRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/reviews')

const dburl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

app.use(express.static(path.join(__dirname,'public')));

mongoose.connect(dburl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }).then(() => console.log('Connection to DB estabilished'));
const methodOverride = require('method-override');
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });

app.engine('ejs' , ejsMate)
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(mongoSanititze({
    replaceWith:'_'
}))

const secret = process.env.SECRET || 'heythere';

const sessionConfigure = {
    name:'session',
    secret,
    resave: false,
    saveUninitialized : true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfigure));
app.use(flash());
app.use(helmet({contentSecurityPolicy:false}));


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localPassport(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
    // console.log(req.session)
    // console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('Success')
    res.locals.error = req.flash('error')
    next()
})

app.get('/fakeUser',async (req,res) => {
    const user = new User({email:'Lakshay@gmail.com',username:'LAKSHAY'})
    const newUser = await User.register(user,'2001')
    res.send(newUser)
})

app.use('/',UserRoutes)
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

app.get('/' , (req,res) => {
    res.render('home')
})

app.get('/makecampground' ,catchAsync(async (req,res) => {
    const camp = new Campground({title:'My Garden',price:'$500',discription:'Contains lots of plants'});
    await camp.save();
    res.send(camp); 
 }))


app.all('*',(req,res,next) => {
    next(new Expresserror('Page not found',404))
})

app.use((err,req,res,next) => {
    const {statuscode = 500}=err;
    if(!err.message) err.message = 'Oh no, Something went wrong!!'
    res.status(statuscode).render('error',{err})
})

const port = process.env.PORT || 3000;

app.listen(port , () => {
    console.log('Serving on port 3000!!')
})