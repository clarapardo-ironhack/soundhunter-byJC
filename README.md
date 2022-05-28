<img src="https://res.cloudinary.com/clarapardo/image/upload/v1653770111/soundhunter_logo_green_kertqz.png" alt="PANG" width="200px"/>

###### By [Jesús Martín](https://github.com/yimapop) and [Clara Pardo](https://github.com/clarapardo)

#### Want to take a look? [Click here](https://clarapardo-ironhack.github.io/PANG-byHC/)

<br>
This project was done in just **1 week** as part of our web development Bootcamp assignments at **Ironhack**. 
*Requirements:* create an app using JavaScript, HTML, Handlebars, and an external API (Spotify & Google Maps). 



---
### About SOUNDHUNTER

It's a platform focused on musical events. 
In it, you will find a community of music lovers, and the latest news about upcoming concerts, which you can follow -as well as their artists-, so you can access them more easily through your own profile saved info, in order not to miss anything.
Among others, it allows you to follow other users, leave comments on events, save events, explore all types of users (artists & music-lovers), and create events (if you have an artist role).


## AUTH ROUTES
| METHOD | URL | DESCRIPTION |
| --- | --- | --- |
| GET | /signin-user | Retrieve the user's data |
| POST | /signin-user | Create a new user |
| GET | /signin-artist | Retrieve the user's data |
| POST | /signin-artist | Pass the artist's name & checks the existance of it in the Spotify API |
| POST | /signin-artist_ | Create a new artist |
| GET | /login | Retrieve the user's/artist's data |
| POST | /login | Set a session for the user/artist |


## BASIC ROUTES
| METHOD | URL | DESCRIPTION |
| --- | --- | --- |
| GET | / | Index |
| GET | /artist/:id | Renders the artist's data |
| GET | /artist/:id/edit | Edit artists' data |
| POST | /artist/:id/edit | Edit the artist's data |
| POST | /artist/:id/delete | Delete the artist's data |


## USER ROUTES
| METHOD | URL | DESCRIPTION |
| --- | --- | --- |
| GET | /user/:id | Renders the user's data |
| GET | /user/:id/edit | Edit user's data |
| POST | /user/:id/edit | Edit the user's data |
| POST | /user/:id/delete | Delete the user's data |



## EVENTS ROUTES
| METHOD | URL | DESCRIPTION |
| --- | --- | --- |
| GET | /event/add-new | |
| POST | /event/add-new | |
| GET | /event/:id | |


