
let map = L.map('map').setView([-25.321124, -57.551063], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// We call the API that returns all the data we need to populate the main map
fetch('http://127.0.0.1:8000')
  .then(response => response.json())
  .then(data => {
    data.denuncias.forEach(denuncia => {
        const marker = L.marker([denuncia.street_coords.lat, denuncia.street_coords.lng]).addTo(map);
    
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
    
        const upload_date = new Date(denuncia.upload_date)

        if (denuncia.image_url === null) {
            marker.bindPopup(`
                
        
                <h3 style="font-size: 1.125rem; font-weight: bold;">${validate_category(denuncia.street_category)}</h3>
                \n
        
                ${ denuncia.opt_address ? 
                    `<span style="font-weight: bold; margin: 0.2rem 0;">Dirección:</span> ${denuncia.opt_address}` : 
                    "" 
                }
                \n
        
                ${ denuncia.opt_user_comment ? 
                    `<p style="font-weight: bold; margin: 0.2rem 0; text-decoration: underline;">Comentario del usuario:</p>
                    <p style="margin: 0.2rem 0;">${denuncia.opt_user_comment}</p>` : 
                    "" 
                }
                \n
        
                <p style="text-align:right;">${ upload_date.toLocaleString('py-ES') }</p>
                
            
            `, { minWidth: 200, maxWidth: 250 }).openPopup()
        } else {
            marker.bindPopup(`
                <img src="${denuncia.image_url}" style="margin: 0 auto; max-width: 150px; margin-bottom: 0.5rem" />
                \n
        
                <h3 style="font-size: 1.125rem; font-weight: bold;">${validate_category(denuncia.street_category)}</h3>
                \n
        
                ${ denuncia.opt_address ? 
                    `<span style="font-weight: bold; margin: 0.2rem 0;">Dirección:</span> ${denuncia.opt_address}` : 
                    "" 
                }
                \n
        
                ${ denuncia.opt_user_comment ? 
                    `<p style="font-weight: bold; margin: 0.2rem 0; text-decoration: underline;">Comentario del usuario:</p>
                    <p style="margin: 0.2rem 0;">${denuncia.opt_user_comment}</p>` : 
                    "" 
                }
                \n
        
                <p style="text-align:right;">${ upload_date.toLocaleString('py-ES') }</p>
                
            
            `, { minWidth: 200, maxWidth: 250 }).openPopup()
        }
    
    });

  })
  .catch(error => console.error(error));

