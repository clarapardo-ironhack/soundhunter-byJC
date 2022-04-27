let map

const latitude = document.querySelector('.latitude').innerHTML * 1
const longitude = document.querySelector('.longitude').innerHTML * 1
latitude = latitude * 1
longitude = longitude * 1


function initMap() {
    renderMap()
    eventMarker()
}

function renderMap() {
    const { Map, Marker } = google.maps

    map = new Map(
        document.querySelector('#eventMap'),
        {
            center: { lat: latitude, lng: longitude },
            zoom: 15
        }
    )
}

function eventMarker() {
    const { Marker } = google.maps

    const position = {
        lat: latitude,
        lng: longitude
    }

    new Marker({ position, map })
}