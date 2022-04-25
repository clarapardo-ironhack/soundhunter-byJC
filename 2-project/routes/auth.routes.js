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
// router.get("/signin", (req, res) => res.render('/auth/signin'))

// router.get('/complete-signin', (req, res, next) => {
// })

router.post("/complete-signin", (req, res, next) => {
    const { username, email, plainPwd } = req.body

    spotifyApi
        .getAvailableGenreSeeds()
        .then(({ body: { genres } }) => {
            res.render('auth/signinDetails', { username, email, plainPwd, genres })
        })
        .catch(err => next(err))
})

router.post("/signin", fileUploader.single('profileImg'), (req, res, next) => {
    const { username, email, plainPwd, name, lastname, location, favoriteGenres } = req.body
    const { path } = req.file

    if (name.length === 0 || lastname.length === 0 || location.length === 0 || favoriteGenres.length === 0) {

        spotifyApi
            .getAvailableGenreSeeds()
            .then(({ body: { genres } }) => {
                res.render('auth/signinDetails', { username, email, name, lastname, location, plainPwd, genres, errorMessage: 'Please complete all the fields' })
            })
            .catch(err => next(err))
        
    } else {

        bcrypt
            .genSalt(saltRounds)
            .then(salt => bcrypt.hash(plainPwd, salt))
            .then(hashedPassword => User.create({ ...req.body, profileImg: path, password: hashedPassword }))
            .then(createdUser => {
                req.session.currentUser = createdUser
                res.redirect('/')
            })
            .catch(err => next(err))
    }
})



// ----------> LOG OUT <----------
router.post('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})



module.exports = router