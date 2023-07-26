const totalDenunciasChart = document.getElementById('stats');
let map = L.map('map').setView([-25.321124, -57.551063], 12);
const street_category = document.querySelector(".street_category")
const submit_btn = document.querySelector(".submit")
const canvasWrapper = document.querySelector(".canvasWrapper")
const canvas = document.querySelector("#stats")
const img = document.querySelector(".img")

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// This function calls the denuncias API with a query parameter used to return denuncias of specific categories
async function apiCall(street_category) {
    const response = await fetch(`http://127.0.0.1:8000/denuncias?street_category=${street_category}`)
    const data = await response.json()
    return data.denuncias
}


async function getTimestamps(denunciasArray) {
    let datesAndCounts = await {  }

    for await (const denuncia of denunciasArray) {
        let parsedDate = new Date(denuncia.upload_date).toLocaleDateString()

        if (!(parsedDate in datesAndCounts)) {
            datesAndCounts[`${parsedDate}`.toString()] = 1
        } else {
            datesAndCounts[`${parsedDate}`.toString()] += 1
        }
    }
    
    return datesAndCounts
}

// When the website first loads, we call the API that returns all the data we need to populate the main map and the first chart
fetch('http://127.0.0.1:8000/denuncias/')
  .then(response => response.json())
  .then(async data => {
    img.style.display = "none"
    let datesAndCounts = await {  } // Parsed dates will go here

    data.denuncias.forEach(async denuncia => {
        // Populate map with markers:
        const marker = L.marker([denuncia.street_coords.lat, denuncia.street_coords.lng]).addTo(map);
        
        // Check and put the proper category on each popup
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

        // Handling image displaying
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

                <div style="margin-top:0.4rem;">
                    <a href="/actualizar/${denuncia.id}">¿Fue arreglada esta calle?</a>
                </div>
        
                <p style="text-align:right;">${ upload_date.toLocaleDateString("en-GB") }</p>
                
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

                <div style="margin-top:0.4rem;">
                    <a href="/actualizar/${denuncia.id}">¿Fue arreglada esta calle?</a>
                </div>

                <p style="text-align:right;">${ upload_date.toLocaleDateString('en-GB') }</p>
                
            `, { minWidth: 200, maxWidth: 250 }).openPopup()
        }

        // Parse dates from database to show them on the chart
        let parsedDate = new Date(denuncia.upload_date).toLocaleDateString("en-GB")
    
        if (!(parsedDate in datesAndCounts)) {
            datesAndCounts[`${parsedDate}`.toString()] = 1
        } else {
            datesAndCounts[`${parsedDate}`.toString()] += 1
        }
    
    });
    
    // Populate chart with data
    const chart = new Chart(totalDenunciasChart, {
        type: 'line',
        data: {
            labels: await Object.keys(datesAndCounts),
            datasets: [{
                label: '# de denuncias',
                data: await Object.values(datesAndCounts),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    
    });

})
.catch(error => console.error(error));




