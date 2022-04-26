let map
const latitude = document.querySelector('.latitude').innerHTML * 1
const longitude = document.querySelector('.longitude').innerHTML * 1

function initMap() {
    console.log('-----------HELLO ESTOY AQUI-----------')
    renderMap()
    getEvent()
}

function renderMap() {
    const { Map, Marker } = google.maps

    map = new Map(
        document.querySelector('#eventMap'),
        {
            center: { lat: 40.392499, lng: -3.698214 },
            zoom: 10
        }
    )
}

function getEvent() {

    axios
        .get('apiMaps/event/:id')
        .then(({ data }) => eventMarker(data))
        .catch(err => console.log(err))
}

function eventMarker(event) {
    const { Marker } = google.maps

    const position = {
        lat: event.location.coordinates[0],
        lng: event.location.coordinates[1]
    }

    new Marker({ position, title: event.name, map })
}