const router = require("express").Router()
const bcrypt = require('bcryptjs')
const spotifyApi = require('./../config/spotify.config')
const User = require('./../models/User.model')
const fileUploader = require("./../config/cloudinary.config")
const { getFullDate, getFullTime } = require("../utils/dateFormatter")
const { isLoggedIn, checkRole } = require("../middleware/authVerification")


const saltRounds = 10

// ----------> ARTIST ROUTES <----------
router.get("/myprofile-artist", (req, res, next) => {
    const { idSpotify } = req.session.currentUser

    spotifyApi
        .getArtist(idSpotify)
        .then(artist => {
            res.render('profile/artist-profile', artist)
        })
        .catch(err => next(err))

})


router.get("/artist/:id", (req, res, next) => {

    const { id } = req.params

    // const isAdmin = req.session.currentUser.role === 'ADMIN'
    // const isArtist = req.session.currentUser.role === 'ARTIST'

    // res.render('profile/artist-profile')
    spotifyApi
        .getArtist(id)
        .then(artist => {
            res.render('profile/artist-profile', artist)
        })
        .catch(err => next(err))
})

router.get("/artist/:id/edit", (req, res, next) => {

    const { idSpotify } = req.params

    User
        .findByIdAndUpdate(idSpotify)
        .then(artist => {
            res.render('profile/artist-edit', artist)
        })
        .catch(err => next(err))
})

router.post("/artist/:id/edit", (req, res, next) => {

    const { idSpotify } = req.params
    const { name, image } = req.body

    User
        .findByIdAndUpdate(idSpotify, { name, image })
        .then(artist => {
            res.redirect('/')
        })
        .catch(err => next(err))
})


// ----------> USER ROUTES <----------
router.get("/profile", (req, res, next) => {

    const { _id } = req.session.currentUser

    const isSelfUser = req.session.currentUser.role === 'USER'

    User
        .findById(_id)
        .populate('friends')
        .populate('savedEvents')
        .then(user => {

            const fullDate = getFullDate(user.createdAt)

            res.render('profile/user-profile', { user, fullDate, isSelfUser })
        })
        .catch(err => next(err))
})


router.get("/user/:id", isLoggedIn, (req, res, next) => {

    const { id } = req.params

    const isSelfUser = req.session.currentUser._id === id
    const isNOTSelfUser = req.session.currentUser._id !== id

    User
        .findById(id)
        .populate('friends')
        .populate('savedEvents')
        .then(user => {

            const fullDate = getFullDate(user.createdAt)

            res.render('profile/user-profile', { user, fullDate, isSelfUser, isNOTSelfUser })
        })
        .catch(err => next(err))
})


router.get("/user/:id/edit", isLoggedIn, (req, res, next) => {

    const { id } = req.params

    const isAdmin = req.session.currentUser.role === 'ADMIN'
    const isUser = req.session.currentUser.role === 'USER'

    User
        .findByIdAndUpdate(id)
        .then(user => {
            res.render('profile/user-edit', user, isAdmin, isUser)
        })
        .catch(err => next(err))
})


router.post("/user/:id/edit", fileUploader.single('image'), (req, res, next) => {

    const { id } = req.params
    const { name, lastname, image, favoriteGenres } = req.body

    const { path } = req.file

    User
        .findByIdAndUpdate(id, { name, lastname, image: path, favoriteGenres })
        .then(user => {
            res.redirect('/')
        })
        .catch(err => next(err))

})

router.post("/user/:id/delete", (req, res, next) => {

    const { id } = req.params

    User
        .findByIdAndDelete(id)
        .then(user => {
            res.redirect('/')
        })
        .catch(err => next(err))
})


// ----------> USER: choose favorite genres <----------
router.get("/signin-user/musicGenres", (req, res, next) => {

    spotifyApi
        .getAvailableGenreSeeds()
        .then(({ body: { genres } }) => {
            res.render('user/completeProfile', { genres })
        })
        .catch(err => next(err))
})

router.post("/signin-user/musicGenres", (req, res, next) => {
    const { favoriteGenres } = req.body
    const id = req.session.currentUser._id

    User
        .findByIdAndUpdate(id, { favoriteGenres })
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})


// ----------> USER: follow new people <----------
router.post("/user/:friendId/follow", (req, res, next) => {
    const myUser = req.session.currentUser
    const userId = req.session.currentUser._id
    const { friendId } = req.params

    console.log('-------MI ID-------' + userId)
    console.log('-------EL ID DE MI FRIEND-------' + friendId)


    if (!myUser.friends.includes(friendId.toString())) {

        const promises = [
            User.findByIdAndUpdate(userId, { $push: { friends: friendId } }),
            User.findByIdAndUpdate(friendId, { $push: { friends: userId } })
        ]

        Promise
            .all(promises)
            .then(([updatedSelf, updatedFriend]) => {
                res.redirect(`/user/${updatedFriend._id}`)
            })
            .catch(err => next(err))

    } else {
        res.redirect(`/user/${friendId}`)
    }
})






module.exports = router
