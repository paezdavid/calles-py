console.log("debug")

let map = L.map('map').setView([-25.321124, -57.551063], 12);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


const coords_index = document.querySelector(".coords_index")
const coords_JSON = JSON.parse(coords_index.getAttribute("value"))

console.log(coords_JSON)

coords_JSON.arr_of_baches.forEach(bache_coord => {
    const marker = L.marker([bache_coord.street_coords.lat, bache_coord.street_coords.lng]).addTo(map);

    function validate_category(category) {
        if (category === "bache") {
            return "Bache"
        } else if (category === "basural") {
            return "Basural"
        } else if (category === "perdida_de_agua") {
            return "Pérdida de Agua"
        } else if (category === "vereda_mal_estado") {
            return "Vereda en mal estado"
        }
    }

    marker.bindPopup(`
        <img src="${bache_coord.image_url}" style="margin: 0 auto; max-width: 150px;" />
        \n
        ${ bache_coord.opt_address ? `Dirección: ${bache_coord.opt_address}` : "" }
        \n
        ${validate_category(bache_coord.street_category)}
    
    `, { minWidth: 200, maxWidth: 250, className: "popup_img" }).openPopup()
});
