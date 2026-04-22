document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("navbar").innerHTML = `
        <div class="navbar">

            <div class="nav-links">
                <a href="index.html">Início</a>
                <a href="calculos.html">Cálculos</a>
                <a href="resultados.html">Resultados</a>
                <a href="dicas.html">Dicas</a>
                <a href="estatisticas.html">Estatísticas</a>
            </div>

            <div class="nav-user">
                <a href="cadastrar.html" class="user-icon">👤</a>
            </div>

        </div>
    `;
});