const router = require("express").Router()
const bcrypt = require('bcryptjs')
const SpotifyWebApi = require("spotify-web-api-node")
const User = require('./../models/User.model')
const fileUploader = require("./../config/cloudinary.config")

const saltRounds = 10

// ######################## ESTO DEBERÍA IR EN APP.JS PERO SI NO NO FUNCIONA ########################################################
// ######################## ADEMÁS NECESITO QUE TODO EL RESTO DE RUTAS TENGAN ACCESO TB #############################################

// Setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// ######################################################################################################################################
// ######################################################################################################################################


// ----------> LOG IN <----------
router.get("/login", (req, res) => res.render('/auth/login'))

router.post("/login", (req, res, next) => {
    const { username, plainPwd } = req.body

    User
        .findOne({ username })
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
    // const { path } = req.file
    let urlImage = ''

    if (req.file === undefined) {
        urlImage = 'https://www.tech101.in/wp-content/uploads/2018/07/blank-profile-picture.png'
    } else {
        const { path } = req.file
        urlImage = path
    }

    if (username === undefined || email === undefined || plainPwd === undefined || name === undefined || lastname === undefined || city === undefined) {

        res.render('auth/signinUser', { username, email, name, lastname, city, plainPwd, errorMessage: 'Please complete all the fields' })

    } else {

        bcrypt
            .genSalt(saltRounds)
            .then(salt => bcrypt.hash(plainPwd, salt))
            .then(hashedPassword => User.create({ ...req.body, image: urlImage, password: hashedPassword }))
            .then(createdUser => {
                req.session.currentUser = createdUser
                res.redirect('/')    //// ESTO TIENE QUE REDIRIGIR PARA PONER TUS GUSTOS MUSICALES ETC.
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
        .then(function (data) {
            if (data.body.artists.items.length === 0) {
                res.render('auth/signinArtist', { errorMessage: 'not an artist' })
            } else {
                res.render('auth/signinArtist2', { name })
            }
        })
        .catch(err => next(err))
})

router.post('/signin-artist_', (req, res, next) => {
    const { name, email, plainPwd, role } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPwd, salt))
        .then(hashedPassword => User.create({ name, email, role, password: hashedPassword }))
        .then(createdUser => {
            req.session.currentUser = createdUser
            res.redirect('/')
        })
        .catch(err => next(err))
})



// router.post("/complete-signin", (req, res, next) => {
//     const { username, email, plainPwd } = req.body

//     spotifyApi
//         .getAvailableGenreSeeds()
//         .then(({ body: { genres } }) => {
//             res.render('auth/signinDetails', { username, email, plainPwd, genres })
//         })
//         .catch(err => next(err))
// })

// router.post("/signin", fileUploader.single('profileImg'), (req, res, next) => {
//     const { username, email, plainPwd, name, lastname, location, favoriteGenres } = req.body
//     const { path } = req.file

//     if (name.length === 0 || lastname.length === 0 || location.length === 0 || favoriteGenres.length === 0) {

//         spotifyApi
//             .getAvailableGenreSeeds()
//             .then(({ body: { genres } }) => {
//                 res.render('auth/signinDetails', { username, email, name, lastname, location, plainPwd, genres, errorMessage: 'Please complete all the fields' })
//             })
//             .catch(err => next(err))

//     } else {

//         bcrypt
//             .genSalt(saltRounds)
//             .then(salt => bcrypt.hash(plainPwd, salt))
//             .then(hashedPassword => User.create({ ...req.body, profileImg: path, password: hashedPassword }))
//             .then(createdUser => {
//                 req.session.currentUser = createdUser
//                 res.redirect('/')
//             })
//             .catch(err => next(err))
//     }
// })



// ----------> LOG OUT <----------
router.post('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})



module.exports = router