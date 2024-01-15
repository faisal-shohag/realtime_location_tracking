// get device lat and long
const loc = document.getElementById("location")


// initializing
var map = L.map('map').setView([25.7181848, 89.2631757], 13)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>|Faisal'
}).addTo(map)

let marker;
let circle;
let zoomed;


ok = (position) => {
    console.log("New location found!")
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const acc = position.coords.accuracy
    console.log(`lat: ${lat}\nlon: ${lon}`)
    loc.innerHTML = `lat: ${lat}<br>lon: ${lon}`
    
    if(marker) {
        map.removeLayer(marker)
    }
    marker = L.marker([lat, lon]).addTo(map)
}

error = (err) => {
    err.code == 1 ?  console.log("Please alllow location service from your device!") : console.log("Something went wrong!")
}

options = {
    enableHighAccuracy: true,
    timeout: 3000,
}

let id = navigator.geolocation.watchPosition(ok, error, options)
console.log(id)
