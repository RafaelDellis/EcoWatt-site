(async function () {
    const area = document.querySelector(".grafico-area");
    const canvas = document.getElementById("graficoBarra");
    const usuario = getUsuario();

    if (!usuario) {
        area.innerHTML = "<p>Faça cadastro para ver suas estatísticas.</p>";
        return;
    }

    try {
        const dados = await consumoPorMes(usuario.id);

        if (!dados.valores.length) {
            area.innerHTML = "<p>Salve um cálculo na página Cálculos.</p>";
            return;
        }

        new Chart(canvas, {
            type: "bar",
            data: {
                labels: dados.labels,
                datasets: [{
                    label: "kWh no mês",
                    data: dados.valores,
                    backgroundColor: "#2d6a4f"
                }]
            }
        });
    } catch (err) {
        area.innerHTML = "<p>Erro ao carregar dados.</p>";
        console.error(err);
    }
})();
