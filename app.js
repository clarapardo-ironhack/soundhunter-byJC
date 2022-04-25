require("dotenv/config")
require("./db")

const express = require("express")
const hbs = require("hbs")
const SpotifyWebApi = require('spotify-web-api-node')
const app = express()
require("./config")(app)

const capitalized = require("./utils/capitalized")
const projectName = "JESÚS + CLARA"

app.locals.appTitle = `PROJECT 2`



// // Setting the spotify-api goes here:
// const spotifyApi = new SpotifyWebApi({
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET
// })

// // Retrieve an access token
// spotifyApi
//     .clientCredentialsGrant()
//     .then(data => spotifyApi.setAccessToken(data.body['access_token']))
//     .catch(error => console.log('Something went wrong when retrieving an access token', error))


require('./config/session.config')(app)

const index = require("./routes/index.routes")
app.use("/", index)

require("./error-handling")(app)

module.exports = app
