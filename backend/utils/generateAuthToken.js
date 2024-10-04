const jwt = require("jsonwebtoken")

const generateAuthToken = (_id,name,lastName,email,isAdmin)=>{
    return jwt.sign({_id,name,lastName,email,isAdmin}, //generating the token
        process.env.JWT_SECRET_KEY,  //secret key used to sign the token
        {expiresIn:"7h"}// expiration time 7hrs
    )
}
module.exports = generateAuthToken