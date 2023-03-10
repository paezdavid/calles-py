
let map = L.map('map').setView([-25.321124, -57.551063], 12);
const coords_index = document.querySelector(".coords_index") // The hidden input where the data is stored
const coords_obj = JSON.parse(coords_index.getAttribute("value")) // Convert the JSON that came from the client into an object

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Iterate over the array of baches that's inside the coords_obj
coords_obj.arr_of_baches.forEach(bache_coord => {
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

    const upload_date = new Date(bache_coord.upload_date)

    marker.bindPopup(`
        <img src="${bache_coord.image_url}" style="margin: 0 auto; max-width: 150px; margin-bottom: 0.5rem" />
        \n

        <h3 style="font-size: 1.125rem; font-weight: bold;">${validate_category(bache_coord.street_category)}</h3>
        \n

        ${ bache_coord.opt_address ? 
            `<span style="font-weight: bold; margin: 0.2rem 0;">Dirección:</span> ${bache_coord.opt_address}` : 
            "" 
        }
        \n

        ${ bache_coord.opt_user_comment ? 
            `<p style="font-weight: bold; margin: 0.2rem 0; text-decoration: underline;">Comentario del usuario:</p>
            <p style="margin: 0.2rem 0;">${bache_coord.opt_user_comment}</p>` : 
            "" 
        }
        \n

        <p style="text-align:right;">${ upload_date.toLocaleString('py-ES') }</p>
        
    
    `, { minWidth: 200, maxWidth: 250 }).openPopup()
});
