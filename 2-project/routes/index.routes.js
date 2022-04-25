const router = require("express").Router()
const SpotifyWebApi = require('spotify-web-api-node')


// HOME PAGE
router.get("/", (req, res, next) => {
  res.render("index")
})

// AUTH ROUTES: log in - sign in - log out
router.use("/", require('./auth.routes'))


module.exports = router
