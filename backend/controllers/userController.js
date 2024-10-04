const User = require("../models/userModel")
const Review = require("../models/reviewModel")
const { hashPassword, comparePasswords } = require("../utils/hashPassword")
const generateAuthToken = require("../utils/generateAuthToken")
const Product = require("../models/productModel")


const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select("-password")
        return res.json(users)
    } catch (error) {
        next(error)
    }
}

const registerUser = async (req, res, next) => {
    try {
        const { name, lastName, email, password } = req.body;

        // Check if all inputs are provided
        if (!(name && lastName && email && password)) {
            return res.status(400).send({ message: "All inputs are required" });
        }

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send({ message: "user exists" });
        }

        // Hash the password
        const hashedPassword = hashPassword(password);

        // Create the new user
        const user = await User.create({
            name,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // Generate authentication token and send response
        res.cookie("access_token", generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })
            .status(201)
            .json({
                success: "User created",
                userCreated: {
                    _id: user._id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            });
    } catch (error) {
        next(error); // Pass error to error-handling middleware
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password, doNotLogout } = req.body;
        if (!(email && password)) {
            return res.status(400).send("All inputs are required");
        }

        const user = await User.findOne({ email }).orFail();
        if (user && comparePasswords(password, user.password)) {
            //  compare passwords
            let cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            };

            if (doNotLogout) {
                cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 };
            }

            return res.cookie(
                "access_token",
                generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin
                ),
                cookieParams
            ).json({
                success: "user logged in",
                userLoggedIn: { _id: user._id, name: user.name, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin, doNotLogout }
            });
        } else {
            return res.status(401).send("wrong credentials")
        }
    } catch (err) {
        next(err);
    }
};

const updateUserProfile = async (req, res, next) => {//updates the user profile.
    try {
        const user = await User.findById(req.user._id).orFail()
        user.name = req.body.name || user.name;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber;
        user.address = req.body.address;
        user.country = req.body.country;
        user.zipCode = req.body.zipCode;
        user.city = req.body.city;
        user.state = req.body.state;
        if (req.body.password !== user.password) {
            user.password = hashPassword(req.body.password);
        }
        await user.save();
        res.json({
            success: "user updated",
            userUpdated: {
                _id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        next(error)
    }
}

const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).orFail()
        return res.send(user)
    } catch (error) {
        next(error)
    }
}

const writeReview = async (req, res, next) => {
    let session;
    try {
      
        session = await Review.startSession();
        session.startTransaction();

        const { comment, rating } = req.body;

        if (!comment || typeof rating === 'undefined' || isNaN(Number(rating))) {
            return res.status(400).send("All inputs are required and rating must be a valid number");
        }

        const ObjectId = require("mongodb").ObjectId;
        let reviewId = new ObjectId();

        await Review.create([
            {
                _id: reviewId,
                comment: comment,
                rating: Number(rating),
                user: { _id: req.user._id, name: req.user.name + " " + req.user.lastName }
            }
        ], { session: session });
        const product = await Product.findById(req.params.productId).populate("reviews").session(session);

        if (!product) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).send("Product not found");
        }

        const alreadyReviewed = product.reviews.find((rev) => rev.user._id.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).send("Product already reviewed");
        }

        let prc = [...product.reviews];
        prc.push({ rating: Number(rating) });
        product.reviews.push(reviewId);

        if (product.reviews.length === 1) {
            product.rating = Number(rating);
            product.reviewsNumber = 1;
        } else {
            product.reviewsNumber = product.reviews.length;
            let ratingCalc = prc.map((item) => Number(item.rating)).reduce((sum, item) => sum + item, 0) / product.reviews.length;
            product.rating = Math.round(ratingCalc);
        }

        await product.save();
        await session.commitTransaction();
        session.endSession();
        res.send("Review created");
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        next(error);
    }
};



const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("name lastName email isAdmin").orFail();
        return res.send(user);
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).orFail();
        user.name = req.body.name || user.name;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;
        await user.save();
        res.send("user updated")
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id).orFail();
        // await user.findByIdAndDelete();
        res.send("user removed")
    } catch (error) {
        next(error)
    }
}
module.exports = { getUsers, registerUser, loginUser, updateUserProfile, getUserProfile, writeReview, getUser, updateUser, deleteUser }