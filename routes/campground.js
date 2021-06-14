const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const {campgroundSchema} = require('../schemas.js')
const Expresserror = require('../utils/Expresserror')
const Campground = require('../models/campground')
const passport = require('passport')
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage});


router.get('/' , catchAsync(campgrounds.index))

router.get('/new' ,isLoggedIn, campgrounds.renderNewForm)

router.post('/' ,isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.createNewForm))
// router.post('/',upload.array('image'),(req,res) => {
//     console.log(req.body,req.files)
//     res.send('GREAT!!')
// })

router.get('/:id' ,catchAsync(campgrounds.showCampground))

router.get('/:id/edit' ,isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))

router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id' ,isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))
module.exports = router;