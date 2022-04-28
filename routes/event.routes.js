const router = require("express").Router()
const spotifyApi = require('./../config/spotify.config')
const Event = require('../models/Event.model')
const User = require('../models/User.model')
const fileUploader = require("./../config/cloudinary.config")
const { getFullDate, getFullTime } = require("../utils/dateFormatter")
const { isLoggedIn, checkRole } = require("../middleware/authVerification")




// ----------> EVENT CREATION <----------
router.get('/add-new', isLoggedIn, checkRole('ARTIST', 'ADMIN'), (req, res) => {

    User
        .find({ role: 'ARTIST' })
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
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})



// ----------> EVENT READING <----------
router.get('/:id', isLoggedIn, (req, res, next) => {
    const { id } = req.params

    Event
        .findById(id)
        .populate('followers')
        .populate('artists')
        .then(selectedEvent => {

            const fullArtists = selectedEvent.artists.map(artist => spotifyApi.getArtist(artist.idSpotify))

            const fullTime = getFullTime(selectedEvent.date)
            const fullDate = getFullDate(selectedEvent.date)

            Promise
                .all(fullArtists)
                .then(responses => {

                    const fullArtistsImage = selectedEvent.artists.map((elm, idx) => {
                        return { ...elm._doc, image: responses[idx].body.images[0].url }
                    })

                    res.render('event/event', { selectedEvent, fullTime, fullDate, fullArtistsImage })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})



// ----------> EVENT JOINING <----------
router.get('/:eventId/join', isLoggedIn, (req, res, next) => {
    const myUser = req.session.currentUser
    const userId = req.session.currentUser._id
    const { eventId } = req.params

    if (!myUser.savedEvents.includes(eventId.toString())) {

        const promises = [
            User.findByIdAndUpdate(userId, { $push: { savedEvents: eventId } }),
            Event.findByIdAndUpdate(eventId, { $push: { followers: myUser } }, { new: true })
        ]

        Promise
            .all(promises)
            .then(([updatedUser, modifiedEvent]) => {
                res.redirect(`event/${modifiedEvent._id}`)
            })
            .catch(err => next(err))

    } else {
        res.redirect('/')
    }
})

// ----------> EVENT COMMENTING <----------
router.post('/:eventId/add-comment', (req, res, next) => {
    const { eventId } = req.params
    const { comment } = req.body

    Event
        .findByIdAndUpdate(eventId, { $push: { comments: { user: req.session.currentUser.username, picture: req.session.currentUser.image, comment } } })
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})


module.exports = router