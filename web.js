require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const router = require('./router/index')
const upload = require('./router/upload')
const errorMiddleware = require('./middlewares/error-middleware');
const cloudinary = require('cloudinary');
const app = express();

app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(cors());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use('/api', router);
app.use('/api', upload);

app.use(errorMiddleware);

const start = () => {
    try {
        mongoose.createConnection(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        app.listen(process.env.PORT || 5000, () => console.log(`Server started on PORT!`))
    } catch (e) {
        console.log('Error in conection !');
    }
}

start()
