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

router.post('/add-new', fileUploader.single('image'), (req, res, next) => {
    const { lat, lng, street, number, city, postcode } = req.body
    const { path } = req.file

    Event
        .create({ ...req.body, address: { street, number, city, postcode }, location: { type: "Point", coordinates: [lat, lng] }, image: path })
        .then(res.redirect('/'))
        .catch(err => next(err))
})



// ----------> EVENT READING <----------
router.get('/:id', (req, res) => {
    const { id } = req.params

    Event
        .findById(id)
        .then(selectedEvent => {
            const fullTime = `${selectedEvent.date.getHours()}:0${selectedEvent.date.getMinutes()}h`
            const fullDate = `${selectedEvent.date.getDate()}.${selectedEvent.date.getMonth() + 1}.${selectedEvent.date.getFullYear()}`

            console.log('------------------------' + fullTime)
            res.render('event/event', { selectedEvent, fullTime, fullDate })
        })
        .catch(err => next(err))
})



module.exports = router