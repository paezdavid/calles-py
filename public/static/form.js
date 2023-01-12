console.log("debug")

let map = L.map('map').setView([-25.28646, -57.647], 11);

// If user clicks the button, we'll ask them for their location:
const askLocation = document.querySelector(".askLocation")
askLocation.addEventListener("click", () => {
    map.locate({ setView: true })
})

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


let popup = L.popup();


function onMapClick(e) {
    const user_coords = document.querySelector(".user_coords")

    // console.log(e.latlng)
    let marker;
    map.on('click', function(e) {
        if (marker)
            map.removeLayer(marker);
        
        marker = L.marker(e.latlng).addTo(map);

        // put map coordinates from marker inside a hidden input
        user_coords.setAttribute("value", `${e.latlng.lat} ${e.latlng.lng}`)

        console.log(e.latlng.lat, e.latlng.lng)
    });
}

map.on('click', onMapClick());
