# project-2

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


