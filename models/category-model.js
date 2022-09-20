const {Schema, model} = require('mongoose');

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
},  {
    timestamps: true
})

module.exports = model("Category", CategorySchema);