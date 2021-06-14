const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const {cloudinary} = require('../cloudinary')
const mapboxtoken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxtoken})

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.createNewForm = async (req,res) => {
    // const campground = new Campground(req.body.campground)
    // campground.images = req.files.map(f => ({url:f.path,filename:f.filename}))
    // campground.author = req.user._id;
    // await campground.save();
    // console.log(campground)
    // req.flash('Success','Sucsessfully made a campground')
    // res.redirect(`/campgrounds/${campground._id}`)


    // const newProduct = new CampGround(req.body.campground)
    // newProduct.author = req.user._id

    // for (let img of req.files) {
    //     newProduct.images.push({ url: img.path, filename: img.filename })
    // }
    //   await newProduct.save()
    // req.flash('success', 'created a new camground');
    // res.redirect(`/campgrounds/${newProduct._id}`)
    
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send()
    // res.send(geodata.body.features[0].geometry.coordinates)
    const campground = new Campground(req.body.campground)
    campground.geometry = geodata.body.features[0].geometry
    campground.author = req.user._id;
    const imgs = req.files.map(f => ({url:f.path,filename:f.filename}))
    campground.images.push(...imgs)
    await campground.save();
    


    req.flash('Success','Successfully created the restaurant')
    res.redirect(`/campgrounds/${campground._id}`)
   
}

module.exports.showCampground = async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show' , {campground})
}

module.exports.renderEditForm = async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    
    if(!campground){
        req.flash('error','Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit' , {campground})
}

module.exports.updateCampground = async(req,res) => {
    const {id} = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f => ({url:f.path,filename:f.filename}))
    campground.images.push(...imgs)
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }


    req.flash('Success','Successfully updated the restaurant')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('Success','Your Campground is deleted succesfully')
    res.redirect('/campgrounds');
}