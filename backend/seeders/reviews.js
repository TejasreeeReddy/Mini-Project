const ObjectId = require("mongodb").ObjectId

const reviews = [
    {
    comment: "Great!!",
    rating: 5,
    user: { _id: new ObjectId(), name: "arya" },
  },
  {
    comment: "Best",
    rating: 5,
    user: { _id: new ObjectId(), name: "arya" },
  },
  {
    comment: "worstt",
    rating: 1,
    user: { _id: new ObjectId(), name: "arya" },
  },
  {
    comment: "Good.",
    rating: 4,
    user: { _id: new ObjectId(), name: "arya" },
  },
  {
    comment: "Fine.",
    rating: 3,
    user: { _id: new ObjectId(), name: "arya" },
  },
]

module.exports = reviews
