const ApiFeatures = require("../middlewares/ApiFeatures");
const Products = require("../models/product-model");
const formidable = require("formidable");
const fs = require('fs')
const path = require('path')
class ProductController extends ApiFeatures {


  async createProduct(req, res, next) {
    try {
      const CURRENT_WORKING_DIR = path.join(process.cwd(), 'uploads')
      const form = new formidable.IncomingForm({uploadDir: CURRENT_WORKING_DIR})
     
      form.parse(req, async (err, fields, files) => {
        const file = files.img
        const fileName = encodeURIComponent(file.originalFilename.replace(/\s/g, "-"));
        try {
          fs.renameSync(file.filepath, path.join(CURRENT_WORKING_DIR, fileName))
        } catch (error) {
          console.log(`error`, error);
        }

        
        if (err) {
          console.log("Error parsing the files");
          return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
          });
          
        }
        const newProduct = await Products.create({
          ...fields,
          images: `uploads/${fileName}`
        });
        await newProduct.save();
        return res.json(newProduct);
    });
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req, res, next) {
    try {
      //http://localhost:5000/api/products?limit=10&sort=-price&title[regex]=al
      const feature = new ApiFeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();
      const products = await feature.query; // mongo find method

      res.json({
        status: 'success',
        result: products.length,
        products: products
      });
    } catch (error) {
      next(error);
    }
  }

  async createReview(req, res, next) {
    const { rating, comments, productId } = req.body;
    
    
    const review = {
      user: req.user.id,
      name: req.body.name,
      rating: Number(rating),
      comments,
    };
    console.log(`comment`, comments);
    const product = await Products.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user.id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user.id.toString())
          (rev.rating = rating), (rev.comments = comments);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  };
}

module.exports = new ProductController();
