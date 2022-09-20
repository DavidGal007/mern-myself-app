const router = require('express').Router()
const cloudinary = require('cloudinary');
const fs = require('fs');


router.post('/upload', (req, res) => {
    try {
        console.log(req.files);
        if(!req.files || Object.keys(req.files).length === 0 ) {
           
            return res.status(400).json({message: 'No file were uploaded!'})
        }
        const file = req.files.file;
        if(file.size > 1024 * 1024 ) { 
          removeTmp(file.tempFilePath) 
          return res.status(400).json({message: "Size to larg!"}) 
        }
            if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") { 
               removeTmp(file.tempFilePath) 
          
            return res.status(400).json({message: 'File format is inccorect!'})
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "shop"
        }, async(err, result) => {
            if(err) throw err;
            removeTmp(file.tempFilePath) 
            res.json({public_id: result.public_id, url: result.secure_url})
        })
        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
});

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err;
    })
};

router.post('/destroy', (req, res) => {
    try {
        const {public_id} = req.body;
    if(!public_id) {
      return res.status(400).json({message: "No Image Selected"})
    }
    cloudinary.v2.uploader.destroy(public_id, async(err, result ) => {
        if(err) throw err;
        res.json({message: "Deleted Image!"})
    })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
})

module.exports = router