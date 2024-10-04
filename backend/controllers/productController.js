const Product = require("../models/productModel");
const recordsPerPage = require("../config/pagination");//defines the no of files to display per page.
const imageValidate = require("../utils/imageValidate")//for validating image uploads

const getProducts = async (req, res, next) => {
    try {
        let query = {};
        let queryCondition = false

        let priceQueryCondition = {};// returns products based on filter condition.
        if (req.query.price) { //it filters through price
            queryCondition = true;
            priceQueryCondition = { price: { $lte: Number(req.query.price) } };
        }
        let ratingQueryCondition = {};
        if (req.query.rating) {// it filters through rating
            queryCondition = true;
            ratingQueryCondition = { rating: { $in: req.query.rating.split(",") } };
        }

        let attrsQueryCondition = [];
        if (req.query.attrs) {
            attrsQueryCondition = req.query.attrs.split(",")
                .reduce((acc, item) => {
                    if (item) {
                        let a = item.split("-");
                        let key = a[0];
                        let values = a.slice(1); // remove the first item (key) and keep the rest as values

                        if (values.length > 0) {
                            let condition = {
                                attrs: {
                                    $elemMatch: {
                                        key: key,
                                        value: { $in: values }
                                    }
                                }
                            };
                            acc.push(condition);
                        }

                        // console.dir(acc, { depth: null });
                    }
                    return acc;
                }, []); // Initial value of `reduce` should be an empty array
            queryCondition = true
        }


        let categoryQueryCondition = {}  //creates a category query condition.
        const categoryName = req.params.categoryName || ""
        if (categoryName) {
            queryCondition = true
            let a = categoryName.replaceAll(",", "/")
            var regEx = new RegExp("^" + a)
            categoryQueryCondition = { category: regEx }
        }
        if (req.query.category) {
            queryCondition = true
            let a = req.query.category.split(",").map((item) => {
                if (item) return new RegExp("^" + item)
            })
            categoryQueryCondition = {
                category: { $in: a }
            }
        }

        //pagination and sorting
        const pageNum = Number(req.query.pageNum) || 1;

        // sorting by name and price etc.
        let sort = {};
        const sortOption = req.query.sort || "";
        if (sortOption) {
            let sortOpt = sortOption.split("_");
            sort = { [sortOpt[0]]: Number(sortOpt[1]) };
        }

        const searchQuery = req.params.searchQuery || ""

        let searchQueryCondition = {}
        let select = {}
        if (searchQuery) {
            queryCondition = true
            searchQueryCondition = {
                $text: {
                    $search: searchQuery
                }
            }
            select = {
                score: { $meta: "textScore" }
            }
            sort = { score: { $meta: "textScore" } }
        }

        if (queryCondition) {
            query = {
                $and: [priceQueryCondition,
                    ratingQueryCondition,
                    categoryQueryCondition,
                    searchQueryCondition,
                    ...attrsQueryCondition],
            };
        }


        const totalProducts = await Product.countDocuments(query);//counts the product matching the aboove query...
        const products = await Product.find(query)// applies the sorting and pagination for the products 
            .select(select)
            .skip(recordsPerPage * (pageNum - 1))
            .sort(sort)
            .limit(recordsPerPage);

        res.json({
            products,
            pageNum,
            paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage),
        });
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate("reviews").orFail()
        res.json(product)
    } catch (error) {
        next(error)
    }
}

const getBestsellers = async (req, res, next) => {
    try {
        const products = await Product.aggregate([
            { $sort: { category: 1, sales: -1 } },
            { $group: { _id: "$category", doc_with_max_sales: { $first: "$$ROOT" } } },
            { $replaceWith: "$doc_with_max_sales" },
            { $match: { sales: { $gt: 0 } } },
            { $project: { _id: 1, name: 1, images: 1, category: 1, description: 1 } },
            { $limit: 3 }
        ])
        res.json(products)
    } catch (err) {
        next(err)
    }
}

//admin functions:
const adminGetProducts = async (req, res, next) => {//fetch products sorted by category.
    try {
        const products = await Product.find({}).sort({ category: 1 }).select("name price category")
        return res.json(products)
    }
    catch (error) {
        next(error)
    }
}

const adminDeleteProduct = async (req, res, next) => {//del the product by id if its find id else returns the error.
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        await Product.findByIdAndDelete(productId).orFail();
        res.json({ message: "Product removed" });
    } catch (error) {
        if (error.name === "DocumentNotFoundError") {
            return res.status(404).json({ message: "Product not found" });
        }
        next(error);
    }
};

const adminCreateProduct = async (req, res, next) => {//taking all the inputs it creates a new product.
    try {
        const product = new Product()
        const { name, description, count, price, category, attributesTable } = req.body
        product.name = name
        product.description = description
        product.count = count
        product.price = price
        product.category = category
        if (attributesTable.length > 0) {
            attributesTable.map((item) => {
                product.attrs.push(item)
            })
        }
        await product.save()
        res.json({
            message: "product created",
            productId: product._id
        })
    }
    catch (error) {
        next(error)
    }
}

const adminUpdateProduct = async (req, res, next) => {//updates an existing product with new info
    try {
        const product = await Product.findById(req.params.id).orFail()
        const { name, description, count, price, category, attributesTable } = req.body
        product.name = name || product.name,
            product.description = description || product.description,
            product.count = count || product.count,
            product.price = price || product.price,
            product.category = category || product.category
        if (attributesTable.length > 0) {
            product.attrs = []
            attributesTable.map((item) => {
                product.attrs.push(item)
            })
        } else {
            product.attrs = []
        }
        await product.save()
        res.json({
            message: "product updated"
        })
    }
    catch (error) {
        next(error)
    }
}

const adminUpload = async (req, res, next) => {//handles the upload images and validates and updates with new img path.
    if (req.query.cloudinary === "true") {
        try {
            let product = await Product.findById(req.query.productId).orFail();
            product.images.push({ path: req.body.url });
            await product.save()
        } catch (error) {
            next(error)
        }
        return
    }
    try {
        if (!req.files || !!req.files.images === false) {
            return res.status(400).send("No files were uploaded");
        }

        const validateResult = imageValidate(req.files.images);
        if (validateResult.error) {
            return res.status(400).send(validateResult.error);
        }

        const path = require("path");
        const { v4: uuidv4 } = require("uuid");

        const uploadDirectory = path.resolve(__dirname, "../../e-commerce-project", "public", "images", "products");

        let product = await Product.findById(req.query.productId).orFail();

        let imagesTable = [];
        if (Array.isArray(req.files.images)) {
            imagesTable = req.files.images;
        } else {
            imagesTable.push(req.files.images);
        }

        for (let image of imagesTable) {
            var fileName = uuidv4() + path.extname(image.name);
            var uploadPath = uploadDirectory + "/" + fileName;

            // Move the image
            await new Promise((resolve, reject) => {
                image.mv(uploadPath, function (err) {
                    if (err) {
                        return reject(err); // Handle the error by rejecting the promise
                    }
                    resolve();
                });
            });

            // Push image path to product's images array
            product.images.push({ path: "/images/products/" + fileName });
        }

        await product.save();
        return res.send("Files uploaded!");
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};


const adminDeleteProductImage = async (req, res, next) => {//deletes the imgaes.
    const imagePath = decodeURIComponent(req.params.imagePath);
    if(req.query.cloudinary === "true"){
        try{
            await Product.findOneAndUpdate({_id:req.params.productId},{
                $pull:{images:{path:imagePath}}
            }).orFail();
            return res.end()
        }catch(error){
            next(error)
        }
        return
    }
    try {
        const path = require("path");
        const finalPath = path.resolve("../e-commerce-project/public") + imagePath;

        const fs = require("fs");
        fs.unlink(finalPath, (err) => {
            if (err) {
                res.status(500).send(err);
            }
        });
        await Product.findOneAndUpdate(
            { _id: req.params.productId },
            { $pull: { images: { path: imagePath } } }
        ).orFail();
        return res.end();
    } catch (err) {
        next(err);
    }
};

module.exports = { getProducts, getProductById, getBestsellers, adminGetProducts, adminDeleteProduct, adminCreateProduct, adminUpdateProduct, adminUpload, adminDeleteProductImage };

