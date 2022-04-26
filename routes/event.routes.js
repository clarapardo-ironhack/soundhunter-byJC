const router = require("express").Router()
// const SpotifyWebApi = require("spotify-web-api-node")
const Event = require('../models/Event.model')
const User = require('../models/User.model')
const fileUploader = require("./../config/cloudinary.config")



// ----------> EVENT CREATION <----------
router.get('/add-new', (req, res) => {

    const roleArtist = { role: 'ARTIST' }

    User
        .find(roleArtist)
        .then(allArtists => {
            res.render('event/new-event', { allArtists })
        })
        .catch(err => next(err))
})

router.post('/add-new', (req, res, next) => {
    const { name, date, artists, description, lat, lng, image } = req.body

    // artists.forEach(artist => {
    //     User
    //         .find({ name: artist })
    //         .then(artistFound => {
    //             if (!artistFound) {
    //                 return
    //             } else {
    //                 User.findByIdAndUpdate(artistFound._id, { events }) // PERO QUIERO PUSHEARLOS, NO SOBREESCRIBIRLOS :S
    //                 return
    //             }
    //         })
    //         .catch(err => next(err))
    // })

    Event
        .create({ name, date, artists, description, location: { type: "Point", coordinates: [lat, lng] }, image })
        .then(res.redirect('/'))
        .catch(err => next(err))
})

module.exports = router