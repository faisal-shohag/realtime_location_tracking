// get device lat and long
const loc = document.getElementById("location")

ok = (position) => {
    console.log("New location found!")
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log(`lat: ${lat}\nlon: ${lon}`)
    loc.innerHTML = `lat: ${lat}<br>lon: ${lon}`
}

error = (err) => {
    err.code == 1 ?  console.log("Please alllow location service from your device!") : console.log("Something went wrong!")
}

navigator.geolocation.watchPosition(ok, error)


