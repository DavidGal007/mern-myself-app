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

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use('/api', router);
app.use('/api', upload);

app.use(errorMiddleware);



