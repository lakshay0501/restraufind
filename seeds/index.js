const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const {places,descriptors} = require('./seedhelpers')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = function(arr){
   return arr[Math.floor(Math.random()*18)];
}

const seedDB = async () =>{
    await Campground.deleteMany({});
    // const c = new Campground({title:'green field'});
    // await c.save();
    for(let i=0;i<100;i++){
        const randomnumber = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*30) + 10;
        const camp = new Campground({
            author: '60a00702cc126916a87c5685',
            location:`${cities[randomnumber].city} , ${cities[randomnumber].state}`,
            title: `${sample(descriptors)} ${sample(places)}`, 
            // image:'http://source.unsplash.com/collection/483251',
            discription:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non, assumenda sit! Pariatur magnam quae delectus amet, possimus qui officia deleniti obcaecati corporis! Assumenda, quaerat. Veritatis vel delectus dolore neque aliquam!',
            price:price,
            geometry:{
                type:"Point",
                coordinates:[cities[randomnumber].longitude,cities[randomnumber].latitude]
            },
            images:[
                {
                url:'https://res.cloudinary.com/dtnh3yibm/image/upload/v1621526086/YelpCamp/y60ktuais67jvzg2eykl.jpg',
                filename:'YelpCamp/y60ktuais67jvzg2eykl'
                }
            ]
        })
       
        await camp.save();
     
    }
}

seedDB().then( () => {
    mongoose.connection.close();
})