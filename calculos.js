async function calcular() {

    let dispositivo = document.getElementById("dispositivo").value.trim();
    let potencia = document.getElementById("potencia").value;
    let horas = document.getElementById("horas").value;
    let dias = document.getElementById("dias").value;
    let valor = document.getElementById("valor").value;

    let horasIA = document.getElementById("ia").value;

    if(dispositivo === "" || potencia === "" || horas === "" || dias === "" || valor === "" || horasIA === ""){
        alert("Preencha todos os campos!");
        return;
    }

    // Consumo do aparelho (kWh)
    let consumo = (potencia * horas * dias) / 1000;

    // Consumo IA (estimativa: 0.02 kWh por hora)
    let consumoIA = horasIA * dias * 0.02;

    let consumoTotal = consumo + consumoIA;

    // Custo
    let custo = consumoTotal * valor;

    // CO2 (kg)
    let co2 = consumoTotal * 0.084;

    // 🌳 Árvores necessárias (1 árvore ≈ 21kg CO2/ano)
    let arvores = co2 / 21;

    document.getElementById("resultado").innerHTML = `
        <p>⚡ Consumo total: <b>${consumoTotal.toFixed(2)} kWh</b></p>
        <p>💰 Custo estimado: <b>R$ ${custo.toFixed(2)}</b></p>
        <p>🌱 Emissão de CO₂: <b>${co2.toFixed(2)} kg</b></p>
        <p>🌳 Árvores necessárias para compensar: <b>${arvores.toFixed(2)}</b></p>
    `;

    const usuario = getUsuario();
    if (usuario) {
        try {
            await salvarCalculo(
                dispositivo,
                Number(potencia),
                Number(horas),
                Number(horasIA),
                Number(dias),
                Number(valor),
                usuario.id
            );
        } catch (err) {
            console.error("Erro ao salvar no Supabase:", err.message);
        }
    }
}