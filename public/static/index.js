const totalDenunciasChart = document.getElementById('stats');
const denunciasPerCityChart = document.getElementById('denunciasPerCity');
let map = L.map('map').setView([-25.321124, -57.551063], 12);
const street_category = document.querySelector(".street_category")
const submit_btn = document.querySelector(".submit")
const canvasWrapper = document.querySelector(".canvasWrapper")
const canvas = document.querySelector("#stats")
const img = document.querySelector(".img")
const denunciasPerCityImg = document.querySelector(".denunciasPerCityImg")
const modalBox = document.querySelector(".modalBox")
const closeModalBox = document.querySelector(".closeModal")


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

// When the website first loads, we call the API that returns all the data we need to populate the main map and the first chart
fetch('http://127.0.0.1:8000/denuncias/')
  .then(response => response.json())
  .then(async data => {
    let datesCount = await {  } // Parsed dates will go here
    let citiesCount = await {  } // Amount of denuncias per city will go here

    for await (const denuncia of data.denuncias) {
        // Populate map with markers:
        const marker = L.marker([denuncia.street_coords.lat, denuncia.street_coords.lng]).addTo(map);

        // Check and put the proper category on each popup
        // Currently only one category available (bache)
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
    
        // Populate object literal datesCount with the amount of denuncias per date
        if (!(parsedDate in datesCount)) {
            datesCount[`${parsedDate}`.toString()] = 1
        } else {
            datesCount[`${parsedDate}`.toString()] += 1
        }

        // Populate object literal citiesCount with the amount of denuncias per city
        if (!(denuncia.city in citiesCount)) {
            citiesCount[`${denuncia.city}`] = 1
        } else {
            citiesCount[`${denuncia.city}`] += 1
        }
    
    };
    
    img.style.display = "none"
    denunciasPerCityImg.style.display = "none"

    // Populate "Denuncias por dia" chart with data
    const chart1 = new Chart(totalDenunciasChart, {
        type: 'bar',
        data: {
            labels: await Object.keys(datesCount),
            datasets: [{
                label: 'Cantidad total de denuncias',
                data: await Object.values(datesCount),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    display: true 
                },
                x: {
                    display: false // Hide X axis labels
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    
    });

    // Populate "Denuncias por dia" chart with data
    const chart2 = new Chart(denunciasPerCityChart, {
        type: 'bar',
        data: {
            labels: await Object.keys(citiesCount),
            datasets: [{
                label: 'Cantidad de denuncias por ciudad',
                data: await Object.values(citiesCount),
                borderWidth: 1,
                backgroundColor: '#FFB1C1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    display: true 
                },
                x: {
                    display: true // City names on X axis below the chart
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    
    });
    




})
.catch(error => console.error(error));
