const bcrypt = require("bcryptjs")//importing bcrypt library which provides funcs for hasing passcodes
const salt = bcrypt.genSaltSync(10)

const hashPassword = password =>bcrypt.hashSync(password,salt)
const comparePasswords = (inputPassoword,hashedPassword)=>bcrypt.compareSync(inputPassoword,hashedPassword)// it compares the plain-text with the stored password.
module.exports = {hashPassword, comparePasswords}
