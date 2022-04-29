const router = require("express").Router()
const bcrypt = require('bcryptjs')
const spotifyApi = require('./../config/spotify.config')
const User = require('./../models/User.model')
const fileUploader = require("./../config/cloudinary.config")

const saltRounds = 10

// ----------> LOG IN <----------
router.get("/login", (req, res) => res.render('/auth/login'))

router.post("/login", (req, res, next) => {
    const { email, plainPwd } = req.body


    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Wrong user' })
                return
            } else if (bcrypt.compareSync(plainPwd, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Wrong password' })
                return
            } else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
        .catch(err => next(err))
})



// ----------> SIGN IN <----------
// ------ 1. USER
router.get('/signin-user', (req, res) => {
    res.render('auth/signinUser')
})

router.post('/signin-user', fileUploader.single('image'), (req, res, next) => {
    const { username, email, plainPwd, name, lastname, city } = req.body
    let urlImage = ''

    if (req.file === undefined) {
        urlImage = 'https://res.cloudinary.com/clarapardo/image/upload/v1651207762/gjj3ykaupudnfgogpilg.png'
    } else {
        const { path } = req.file
        urlImage = path
    }

    if (username === '' || email === '' || plainPwd === '' || name === '' || lastname === '' || city === '') {

        res.render('auth/signinUser', { username, email, name, lastname, city, plainPwd, errorMessage: 'Please complete all the fields' })

    } else {

        bcrypt
            .genSalt(saltRounds)
            .then(salt => bcrypt.hash(plainPwd, salt))
            .then(hashedPassword => User.create({ ...req.body, image: urlImage, password: hashedPassword }))
            .then(createdUser => {
                req.session.currentUser = createdUser
                res.redirect('/signin-user/musicGenres')
            })
            .catch(err => next(err))
    }
})


// ------ 2. ARTIST
router.get('/signin-artist', (req, res) => {
    res.render('auth/signinArtist')
})

router.post('/signin-artist', (req, res, next) => {
    const { name } = req.body

    spotifyApi
        .searchArtists(`${name}`)
        .then(data => {
            // console.log(data.body.artists.items[0])
            if (data.body.artists.items.length === 0) {
                res.render('auth/signinArtist', { errorMessage: 'not an artist' })
            } else {
                res.render('auth/signinArtist2', data.body.artists.items[0])
            }
        })
        .catch(err => next(err))
})

router.post('/signin-artist_', (req, res, next) => {
    const { name, email, plainPwd, role, idSpotify } = req.body

    // console.log('-----------EL ID QUE HA COGIDO DE SPOTIFY ES-----------' + idSpotify)
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPwd, salt))
        .then(hashedPassword => User.create({ name, email, role, password: hashedPassword, idSpotify }))
        .then(createdUser => {
            req.session.currentUser = createdUser

            spotifyApi
                .getArtist(idSpotify)
                .then(user => {
                    res.redirect("/")
                })
                .catch(err => next(err))
            // res.redirect('/artist/{{idSpotify}}')
        })
        .catch(err => next(err))
})




// ----------> LOG OUT <----------
router.post('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})



module.exports = router