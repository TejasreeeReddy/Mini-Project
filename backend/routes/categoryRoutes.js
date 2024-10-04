const express = require("express")
const router = express.Router()
const {getCategories,newCategory,deleteCategory,saveAttr} = require("../controllers/categoryController")
const {verifyIsLoggedIn,verifyIsAdmin} = require("../middleware/verifyAuthToken")

//get request
router.get("/",getCategories)

router.use(verifyIsLoggedIn)
router.use(verifyIsAdmin)
//post request
router.post("/",newCategory)

//delete request
router.delete("/:category",deleteCategory)
router.post("/attr",saveAttr)
module.exports = router