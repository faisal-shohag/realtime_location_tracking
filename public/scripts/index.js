const clientList = document.querySelector('#clients')

// socket io
let socket = io()

// initializing
let map = L.map('map').setView([25.7181848, 89.2631757], 13)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a traget="_blank" href="https://github.com/faisal-shohag/realtime_location_tracking">faisal-shohag</a>'
}).addTo(map)

// adding some custom marker 
// let messIcon = L.icon({
//     iconUrl: 'https://cdn-icons-png.flaticon.com/512/4904/4904150.png',
//     iconSize: [50, 50],
//     iconAnchor:   [50, 50],
//     popupAnchor:  [-3, -76]
// })
// L.marker([25.7182115, 89.2631706], {icon: messIcon}).addTo(map).bindPopup("My mess is here...")

let marker;
let circle;
let zoomed;


ok = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const acc = position.coords.accuracy
    socket.emit('client-location', {lat, lon, acc})
}

error = (err) => {
    err.code == 1 ?  console.log("Please alllow location service from your device!") : console.log("Something went wrong!")
}

options = {
    enableHighAccuracy: true,
    timeout: 3000,
}

let id = navigator.geolocation.watchPosition(ok, error, options)


// Realtime user navigation
let connected_users = {}

socket.on('server-location', (data)=> {
    console.log("Location from server: ", data);
    clientList.innerHTML = ''
    connected_users[data.id] = {
        lat: data.lat,
        lon: data.lon,
        acc: data.acc,
        pointMarker: function() {
            L.marker([data.lat, data.lon]).addTo(map).bindTooltip(data.id, {parmanent: true, direction: 'top'}).openTooltip()
        },
        
    }
    console.log("After update: ", connected_users)

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
})

socket.on('disconnected_user', (data) => {
    console.log("Disconnected user: ", data)
    delete connected_users[data.id]
    console.log("After disconnect: ", connected_users)
})


// Creating coordinates for drawing boundary layer for brur
const coordinates = [
    [25.7196137, 89.2578151],
    [25.7195662, 89.2587164],
    [25.7200268, 89.2587119],
    [25.7201871, 89.2587044],
    [25.7202841, 89.2587007],
    [25.7203736, 89.2586464],
    [25.7204099, 89.2585509],
    [25.7204137, 89.2584817],
    [25.7206831, 89.2584849],
    [25.7214862, 89.2584769],
    [25.7212410, 89.2589746],
    [25.7211714, 89.2591649],
    [25.7211287, 89.2593541],
    [25.7209045, 89.2605412],
    [25.7202663, 89.2608181],
    [25.7196610, 89.2610890],
    [25.7184890, 89.2616321],
    [25.7180033, 89.2618574],
    [25.7175103, 89.2620814],
    [25.7168144, 89.2623188],
    [25.7166162, 89.2623214],
    [25.7164773, 89.2622852],
    [25.7160749, 89.2621203],
    [25.7158393, 89.2619942],
    [25.7155856, 89.2618453],
    [25.7154647, 89.2618266],
    [25.7153886, 89.2617890],
    [25.7148751, 89.2615463],
    [25.7142927, 89.2612271],
    [25.7142975, 89.2609079],
    [25.7142979, 89.2604752],
    [25.7142980, 89.2600852],
    [25.7143222, 89.2593606],
    [25.7143603, 89.2588276],
    [25.7144078, 89.2581786],
    [25.7144956, 89.2573463],
    [25.7145467, 89.2567496],
    [25.7168565, 89.2565839],
    [25.7168034, 89.2574557],
    [25.7176105, 89.2575093],
    [25.7176080, 89.2576971],
    [25.7196137, 89.2578151],
];


const mess =[
    [25.718266, 89.262706],
    [25.717774, 89.262712],
    [25.717886, 89.263553],
    [25.718278, 89.263420]
]
// console.log(coordinates);
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






