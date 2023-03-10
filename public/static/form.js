const user_coords = document.querySelector(".user_coords")

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


// ALERTS (if form is not properly completed)
const location_alert = document.querySelector(".location-alert")
const location_alert_border = document.querySelector(".location-alert-border")
const submitBtn = document.querySelector(".submitBtn")
const imgInput = document.querySelector(".img-input")
submitBtn.addEventListener("click", () => {
    if (user_coords.getAttribute("value") === null) {
        location_alert.style.display = "block"
        location_alert_border.style.border = "1px solid red"
    }
})



function onMapClick(e) {
    let marker;

    map.on('click', function(e) {
        if (marker)
            map.removeLayer(marker);
        
        marker = L.marker(e.latlng).addTo(map);

        location_alert.style.display = "none"
        location_alert_border.style.border = "none"
    
        // put map coordinates from marker inside a hidden input
        user_coords.setAttribute("value", `${e.latlng.lat} ${e.latlng.lng}`)
    });
}

map.on('click', onMapClick());
