const ctx = document.getElementById('stats');

// Call API to get all the data
async function apiCall() {
    const response = await fetch("http://127.0.0.1:8000/")
    const data = await response.json()
    return data
}

// Get the timestamps and the amount of "denuncias" per date
async function getTimestamps(dataFromApi) {
    let datesAndCounts = await {  }

    for await (const denuncia of dataFromApi.denuncias) {
        let parsedDate = new Date(denuncia.upload_date).toLocaleDateString()

        if (!(parsedDate in datesAndCounts)) {
            datesAndCounts[`${parsedDate}`.toString()] = 1
        } else {
            datesAndCounts[`${parsedDate}`.toString()] += 1
        }

    }
    
    return datesAndCounts
}

async function populateChart() {
    const dataFromApi = await apiCall()

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: await getTimestamps(dataFromApi).then(obj => Object.keys(obj)),
            datasets: [{
                label: '# de denuncias',
                data: await getTimestamps(dataFromApi).then(obj => Object.values(obj)),
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
    
}

populateChart()
