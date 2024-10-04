const mongoose = require("mongoose")// imported mongoose library 
 

const categorySchema = mongoose.Schema({  //schema(using mongoose) which defines the structure of category.
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        default:"default category description"
    },
    image:{
        type:String,
        default:"/images/tablets-category.png"
    },
    attrs:[{key:{type:String},value:[{type:String}]}]
})

categorySchema.index({description:1})
const Category = mongoose.model("Category",categorySchema)
module.exports = Category