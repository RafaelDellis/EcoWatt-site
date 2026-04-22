const ctx = document.getElementById('grafico');

new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Energia', 'CO2', 'Outros'],
        datasets: [{
            data: [40, 30, 30]
        }]
    }
});

new Chart(document.getElementById("graficoBarra"), {
        type: "bar",
        data: {
            labels: ["Jan", "Fev", "Mar", "Abr"],
            datasets: [{
                label: "kWh",
                data: [200, 250, 180, 300]
            }]
        }
    });