const router = require("express").Router()
const SpotifyWebApi = require('spotify-web-api-node')
const Event = require('./../models/Event.model')

// HOME PAGE
router.get("/", (req, res, next) => {

  Event
    .find()
    .then(allEvents => {
      res.render("index", { allEvents })
    })
    .catch(err => (err))

})

// AUTH ROUTES: log in - sign in - log out
router.use("/", require('./auth.routes'))
router.use("/", require('./user.routes'))

// EVENTS ROUTES
router.use("/event", require('./event.routes'))

// GOOGLE MAPS API
router.use('/apiMaps', require('./apiMaps.routes'))

module.exports = router
