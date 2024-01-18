function main(username) {

const clientList = document.querySelector('#clients')
const bottomCard = document.querySelector('.bottom-card')
const mylatlon = document.querySelector('.my-latlon')
const splash = document.querySelector('.splash')
// socket io
let socket = io.connect('https://locationreal.onrender.com/')

// initializing
let map = L.map('map').setView([25.7181848, 89.2631757], 13)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a traget="_blank" href="https://github.com/faisal-shohag/realtime_location_tracking">faisal-shohag</a>'
}).addTo(map)


let liveSetView = false;
let present_destination;

ok = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const acc = position.coords.accuracy;
    present_destination = [lat, lon]
    if(liveSetView) {
        map.setView([data.lat, data.lon], 17)
    }
    socket.emit('client-location', {lat, lon, acc, username: username})
    mylatlon.innerHTML = `Lat: ${lat} Lon: ${lon}`
    let distance = calculateDistance(lat, lon, 25.71686, 89.2622945)
    
    bottomCard.innerHTML = `
        <div class="distance">${distance < 1 ? (distance*1000).toFixed(2)+"<span>M</span>" : distance.toFixed(2)+"<span>KM</span>"}</div>
        <div class="location">BRUR Campus</div>
        `
    // getLocationByLatLon(lat, lon)
    // .then(address => {
    //     address = address+','
    //     locationName = address.split(',')[0]
    //     mylatlon.innerHTML += `<br>${locationName}`
    //     // console.log(locationName)
    // })
}

error = (err) => {
    err.code == 1 ?  console.log("Please alllow location service from your device!") : console.log("Something went wrong!", err)
}

options = {
    enableHighAccuracy: true,
    timeout: 3000,
}

navigator.geolocation.watchPosition(ok, error, options)

//join location
if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        let data = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }
        map.setView([data.lat, data.lon], 17)
        socket.emit('client-join-location', {...data, username: username})

    })

} else {
    console.log("Your browser doesn't support geolocation!")
}

// notify user join
socket.on('client-join-server', (data) =>  {
    joinToast(`${data.username ? data.username : data.id} has joined to the map!`)
    notifyMe(`${data.username ? data.username : data.id} joined just now!`, `${data.username ? data.username : data.id} has joined to the map!`)
})

// Realtime user navigation
let connected_users = {}
let updateMap = () => {
    clientList.innerHTML = ''
    map.eachLayer(layer=> {
        if(layer instanceof L.Marker) {
            map.removeLayer(layer)
        } 
    })

    for(let key in connected_users) {
        if(connected_users.hasOwnProperty(key)) {
            connected_users[key].pointMarker();
            campus_stat = rayCasting([connected_users[key].lat, connected_users[key].lon], coordinates)
            clientList.innerHTML += `
            <div class="client-card">
            <div class="id">${key}</div>
            <div class="latlon">Lat: ${connected_users[key].lat} | Lon: ${connected_users[key].lon}</div>
            <div class="status">Campus status: ${campus_stat ? "Inside campus!" : "Outside campus!"}</div>
            </div>
            `
        }
    }
}

socket.on('server-location', (data)=> {
    connected_users[data.id] = {
        lat: data.lat,
        lon: data.lon,
        acc: data.acc,
        pointMarker: function() {
            L.marker([data.lat, data.lon]).addTo(map).bindTooltip(data.username ? data.username : data.id, {parmanent: true, direction: 'top'}).openTooltip()
        },
        
    }
    updateMap()
})

socket.on('disconnected_user', (data) => {
    delete connected_users[data.id]
    updateMap()
    leftToast(`${data.username ? data.username : data.id} has left from the map!`)
})


let polygonCampus = L.polygon(coordinates, { color: 'crimson' }).addTo(map).bindPopup("Begum Rokeya University! The campus boundary!");
map.fitBounds(polygonCampus.getBounds());
let polygonMess = L.polygon(mess, { color: 'green' }).addTo(map).bindPopup("Mess! The mess boundary!");
map.fitBounds(polygonMess.getBounds());

let rayCasting = (coords, polygon) => {
    let x = coords[0];
    let y = coords[1];

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0], yi = polygon[i][1];
        let xj = polygon[j][0], yj = polygon[j][1];

        let intersect = ((yi > y) != (yj > y)) &&
            (x < ((xj - xi) * (y - yi) / (yj - yi)) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
}







}