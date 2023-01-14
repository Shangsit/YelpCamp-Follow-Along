const mongoose = require('mongoose');
const cities = require('./cities');
const campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers')

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campground({
            author: '637f2ec771fd851e51806ab6',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/drhcvj4fg/image/upload/v1669643425/YelpCamp/rd06xh7zww32ntx4usn5.jpg',
                    filename: 'YelpCamp/rd06xh7zww32ntx4usn5',

                },
                {
                    url: 'https://res.cloudinary.com/drhcvj4fg/image/upload/v1669822023/YelpCamp/ojgqekfqoxmxsncfnznh.jpg',
                    filename: 'YelpCamp/tjqbq7h64bvi7syczkt0',

                }
            ],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa, hic explicabo deserunt facilis molestiae tenetur? Est, numquam consectetur? Quidem, ut?',
            price: price
        })
        await camp.save();
    }
}

// since seedDb() is an async function so it returns a promise
seedDb().then(() => {
    mongoose.connection.close();
}) 