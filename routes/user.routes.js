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


// ----------> ARTIST ROUTES <----------

router.get("/artist/:id", (req, res, next) => {

    const { id } = req.params

    // res.render('profile/artist-profile')
    spotifyApi
        .getArtist(id)
        .then((artist) => {
            console.log(artist)
            res.render('profile/artist-profile', { artist })
        })
        .catch(err => next(err))

})




module.exports = router
