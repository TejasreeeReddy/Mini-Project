const bcrypt = require("bcryptjs")
const ObjectId = require("mongodb").ObjectId
const users=[
  {
      name:'admin',
      lastName:'admin',
      email:'admin@admin.com',
      password: bcrypt.hashSync('admin@admin.com',10),
      isAdmin: true,
  },
  {
      name:'tejasree',
      lastName:'reddy',
      email:'tejsaree@admin.com',
      password: bcrypt.hashSync('tejasree@admin.com',10),
      isAdmin: true,
  },
  {
      _id:new ObjectId("66f139fc442145cd4e5bc793"),
      name:'John',
      lastName:'Garh',
      email: 'john@gmail.com',
      password: bcrypt.hashSync('john@doe.com',10),
  },
]

module.exports = users
