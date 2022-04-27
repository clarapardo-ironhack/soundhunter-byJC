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
router.get('/:id', (req, res, next) => {
    const { id } = req.params

    Event
        .findById(id)
        .populate('followers')
        .populate('artists')
        .then(selectedEvent => {

            const fullTime = `${selectedEvent.date.getHours()}:,${selectedEvent.date.getMinutes()}h`
            const fullDate = `${selectedEvent.date.getDate()}.${selectedEvent.date.getMonth() + 1}.${selectedEvent.date.getFullYear()}`

            res.render('event/event', { selectedEvent, fullTime, fullDate })
        })
        .catch(err => next(err))
})



// ----------> EVENT JOINING <----------
router.get('/:eventId/join', (req, res, next) => {
    const myUser = req.session.currentUser
    const userId = req.session.currentUser._id
    const { eventId } = req.params


    if (!myUser.savedEvents.includes(eventId.toString())) {

        User
            .findByIdAndUpdate(userId, { $push: { savedEvents: eventId } }, { new: true })
            .then(selectedEvent => {

                Event
                    .findByIdAndUpdate(eventId, { $push: { followers: myUser } }, { new: true })
                    .then(selectedEvent => {
                        console.log('----------SOY MI EVENTO-----------' + selectedEvent.followers)
                        res.redirect(`event/${selectedEvent._id}`)
                    })
                    .catch(err => next(err))
            })
            .catch(err => next(err))
    } else {

        res.redirect('/')
    }
})

// ----------> EVENT COMMENTING <----------
router.post('/:eventId/add-comment', (req, res, next) => {
    const myUser = req.session.currentUser
    const { eventId } = req.params
    const { comment } = req.body

    Event
        .findByIdAndUpdate(eventId, { $push: { comments: { user: req.session.currentUser.username, comment } } })
        .then(res.redirect('/'))
        .catch(err => next(err))
})


module.exports = router