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


## 'NOT YET DONE' ROUTES
| METHOD | URL | DESCRIPTION |
| --- | --- | --- |
| GET | /profile | Retrieve all the user's profile data |
| GET | /profile-edit/{{id}} | Retrieve user |
| POST | /profile-edit/{{id}} | Set new changes in user |
| GET | /{{user.username}} | Retrieve another user profile |
| GET | /events | Retrieve all the events |
| GET | /event-{{id}} | Retrieves the info of the event |
| GET | /artist-profile | Retrieves the artist's info: albums, etc. |
