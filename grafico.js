const ctx = document.getElementById("grafico");

if (ctx) {
    (async function () {
        let labels = [];
        let valores = [];
        const cores = ["#4caf50", "#81c784", "#a5d6a7", "#66bb6a", "#2e7d32", "#c8e6c9", "#388e3c", "#1b5e20"];

        const elConsumo = document.getElementById("consumo-total");
        const elCusto = document.getElementById("custo-estimado");
        const elCo2 = document.getElementById("emissao-co2");
        const elArvores = document.getElementById("compensacao");

        function semDados(msg) {
            if (elConsumo) elConsumo.textContent = msg;
            if (elCusto) elCusto.textContent = "—";
            if (elCo2) elCo2.textContent = "—";
            if (elArvores) elArvores.textContent = "—";
        }

        const usuario = getUsuario();
        if (!usuario) {
            semDados("Faça cadastro para ver seus resultados");
            return;
        }

        try {
            const lista = await listarCalculos(usuario.id);
            if (!lista.length) {
                semDados("Nenhum cálculo salvo ainda");
                return;
            }

            const graficoDados = consumoPorDispositivo(lista);
            const m = metricasCalculos(lista);
            labels = graficoDados.labels;
            valores = graficoDados.valores;

            if (elConsumo) elConsumo.textContent = m.consumoTotal.toFixed(2) + " kWh";
            if (elCusto) elCusto.textContent = "R$ " + m.custo.toFixed(2);
            if (elCo2) elCo2.textContent = m.co2.toFixed(2) + " kg";
            if (elArvores) elArvores.textContent = m.arvores.toFixed(2) + " árvores";
        } catch (err) {
            console.error(err.message);
            semDados("Erro ao carregar resultados");
            return;
        }

        new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: valores,
                    backgroundColor: labels.map(function (_, index) {
                        return cores[index % cores.length];
                    })
                }]
            },
            options: {
                plugins: {
                    legend: { position: "bottom" }
                }
            }
        });
    })();
}