const router = require("express").Router()
const bcrypt = require('bcryptjs')
const spotifyApi = require('./../config/spotify.config')
const User = require('./../models/User.model')
const fileUploader = require("./../config/cloudinary.config")
const { getFullDate, getFullTime } = require("../utils/dateFormatter")
const { isLoggedIn, checkRole } = require("../middleware/authVerification")

const saltRounds = 10

// ----------> ARTIST ROUTES <----------
router.get("/myprofile-artist", isLoggedIn, (req, res, next) => {
    const id = req.session.currentUser._id

    User
        .findById(id)
        .then(artist => {

            spotifyApi
                .getArtist(artist.idSpotify)
                .then(spotifyArtist => {

                    let artistAux = artist

                    let isSelfArtist = req.session.currentUser.idSpotify === spotifyArtist.body.id
                    let isUser = req.session.currentUser.role === 'USER'

                    res.render('profile/artist-profile', { artistAux, spotifyArtist, isSelfArtist, isUser })
                })
                .catch(err => next(err))

        })
        .catch(err => next(err))
})

router.get("/artist/:id", isLoggedIn, (req, res, next) => {

    const { id } = req.params

    
    let isAdmin = req.session.currentUser.role === 'ADMIN'

    User
        .find({ idSpotify: id })
        .then(artist => {

            let idSpoti = artist[0].idSpotify
            spotifyApi
                .getArtist(idSpoti)
                .then(spotifyArtist => {

                    let artistAux = artist[0]

                    let isSelfArtist = req.session.currentUser.idSpotify === spotifyArtist.body.id
                    let isUser = req.session.currentUser.role === 'USER'

                    res.render('profile/artist-profile', { artistAux, spotifyArtist, isSelfArtist, isUser, isAdmin })
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
})

// ----------> ARTIST: follow <----------
router.post("/artist_/:artistId/follow", isLoggedIn, (req, res, next) => {
    const myUser = req.session.currentUser
    const userId = req.session.currentUser._id
    const { artistId } = req.params
    let { spotifyArtistId } = req.body


    if (!myUser.favouriteArtists.includes(artistId.toString())) {

        User.findByIdAndUpdate(userId, { $push: { favouriteArtists: artistId } }, { new: true })
            .then(user => {
                res.redirect(`/artist/${spotifyArtistId}`)
            })
            .catch(err => next(err))

    } else {
        res.redirect(`/artist/${spotifyArtistId}`)
    }
})

router.get("/artist/:idSpotify/edit", isLoggedIn, (req, res, next) => {

    const { idSpotify } = req.params

    User
        .find({ idSpotify })
        .then(artist => {
            let ourArtist = artist[0]
            res.render('profile/artist-edit', ourArtist)
        })
        .catch(err => next(err))
})

router.post("/artist/:idSpotify/edit", isLoggedIn, (req, res, next) => {

    const { idSpotify } = req.params
    const { email, id } = req.body

    User
        .findByIdAndUpdate(id, { email })
        .then(artist => {
            let spotifyIdReal = artist.idSpotify
            res.redirect(`/artist/${spotifyIdReal}`)
        })
        .catch(err => next(err))
})

router.post("/artist/:idSpotify/delete", isLoggedIn, (req, res, next) => {

    const { idSpotify } = req.params
    const { id } = req.body

    let artistToDelete = User
        .find({idSpotify})
        .then(artist => {
            console.log('----EL ID ARTISTA ESSSSSS-----'+ artist[0]._id)

            let idArtist = artist[0]._id

            return User.findByIdAndDelete(idArtist)
        })
        .then(()=>{
            res.redirect('/')
        })
        .catch(err => next(err))


    // User
    //     .findByIdAndDelete(artistToDelete._id)
    //     .then(()=>{
    //         res.redirect('/')
    //     })
    //     .catch(err => next(err))

})


// ----------> USER ROUTES <----------
router.get("/profile", isLoggedIn, (req, res, next) => {

    if (req.session.currentUser.role === 'ARTIST') {

        res.redirect('/myprofile-artist')

    } else if (req.session.currentUser.role === 'USER' || req.session.currentUser.role === 'ADMIN' ) {

        const { _id } = req.session.currentUser
        const isSelfUser = req.session.currentUser.role === 'USER'

        User
            .findById(_id)
            .populate('friends')
            .populate('savedEvents')
            .populate('favouriteArtists')
            .then(user => {

                const fullDate = getFullDate(user.createdAt)

                res.render('profile/user-profile', { user, fullDate, isSelfUser })
            })
            .catch(err => next(err))
    }
})


router.get("/user/:id", isLoggedIn, (req, res, next) => {

    const { id } = req.params

    const isSelfUser = req.session.currentUser._id === id
    let isNOTSelfUser
    // const isNOTSelfUser = req.session.currentUser._id !== id

    if (req.session.currentUser._id !== id && req.session.currentUser.role === 'ADMIN') {

    } else if(req.session.currentUser._id !== id) {
        isNOTSelfUser = true
    }

    const isAdmin = req.session.currentUser.role === 'ADMIN'

    User
        .findById(id)
        .populate('friends')
        .populate('savedEvents')
        .then(user => {

            const fullDate = getFullDate(user.createdAt)

            res.render('profile/user-profile', { user, fullDate, isSelfUser, isNOTSelfUser, isAdmin })
        })
        .catch(err => next(err))
})


router.get("/user/:id/edit", isLoggedIn, (req, res, next) => {

    const { id } = req.params

    spotifyApi
        .getAvailableGenreSeeds()
        .then(({ body: { genres } }) => {

            User
                .findByIdAndUpdate(id)
                .then(user => {
                    res.render('profile/user-edit', { user, genres })
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
})


router.post("/user/:id/edit", isLoggedIn, fileUploader.single('image'), (req, res, next) => {

    const { id } = req.params
    const { name, lastname, image, favoriteGenres } = req.body
    let urlImage = ''

    if (req.file === undefined) {

        User
            .findByIdAndUpdate(id, { name, lastname, favoriteGenres })
            .then(user => {
                res.redirect('/profile')
            })
            .catch(err => next(err))

    } else {

        const { path } = req.file
        urlImage = path

        User
            .findByIdAndUpdate(id, { name, lastname, image: urlImage, favoriteGenres })
            .then(user => {
                res.redirect('/profile')
            })
            .catch(err => next(err))
    }
})

router.post("/user/:id/delete", isLoggedIn, (req, res, next) => {

    const { id } = req.params

    User
        .findByIdAndDelete(id)
        .then(user => {
            res.redirect('/')
        })
        .catch(err => next(err))
})


// ----------> USER: choose favorite genres <----------
router.get("/signin-user/musicGenres", isLoggedIn, (req, res, next) => {

    spotifyApi
        .getAvailableGenreSeeds()
        .then(({ body: { genres } }) => {
            res.render('user/completeProfile', { genres })
        })
        .catch(err => next(err))
})

router.post("/signin-user/musicGenres", isLoggedIn, (req, res, next) => {
    const { favoriteGenres } = req.body
    const id = req.session.currentUser._id

    User
        .findByIdAndUpdate(id, { favoriteGenres })
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})


// ----------> USER: follow new people <----------
router.post("/user/:friendId/follow", isLoggedIn, (req, res, next) => {
    const myUser = req.session.currentUser
    const userId = req.session.currentUser._id
    const { friendId } = req.params

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

// ----------> COMMUNITY <----------

router.get("/community", isLoggedIn, (req, res, next) => {

    User
        .find()
        .then(allUsers => {
            res.render('user/all-users', { allUsers })
        })
        .catch(err => (err))

})

router.post("/community/:friendId/follow", isLoggedIn, (req, res, next) => {
    const myUser = req.session.currentUser
    const userId = req.session.currentUser._id
    const { friendId } = req.params

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
