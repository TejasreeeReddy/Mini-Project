const jwt = require("jsonwebtoken")// verifying token
const verifyIsLoggedIn = (req, res, next) => {
    
    try {
        const token = req.cookies.access_token
        if(!token) {//if the token is not found then it sends this response.
           return res.status(403).send("A token is required for authentication") 
        }

        try {  //using jwt verifies the token against the seckey  in .env 
           const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = decoded
            next()
        } catch (err) {
          return res.status(401).send("Unauthorized. Invalid Token")  
        }

    } catch(err) {
        next(err)
    }
}

const verifyIsAdmin = (req, res, next) => {//checks the admin login
    
    if(req.user && req.user.isAdmin) {
        next()
    } else {
        return res.status(401).send("Unauthorized. Admin required")
    }
}

module.exports = { verifyIsLoggedIn, verifyIsAdmin }
