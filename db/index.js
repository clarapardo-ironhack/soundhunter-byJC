const mongoose = require("mongoose")
const User = require("../models/User.model")
const Event = require("../models/Event.model")
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://clarapardo:Hello123@cluster0.sev51.mongodb.net/soundhunter2"


mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    // return User.deleteMany()
  })

  .then(() => User.syncIndexes())
  // .then(() => Event.deleteMany())
  .then(() => Event.syncIndexes())
  .catch((err) => {
    console.error("Error connecting to mongo: ", err)
  })
