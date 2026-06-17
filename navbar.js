document.addEventListener("DOMContentLoaded", function () {

    let pagina = window.location.pathname.split("/").pop();

    document.getElementById("navbar").innerHTML = `
        <div class="navbar">

            <div class="nav-links">

                <a href="index.html"
                class="${pagina === 'index.html' ? 'active' : ''}">
                Início
                </a>

                <a href="calculos.html"
                class="${pagina === 'calculos.html' ? 'active' : ''}">
                Cálculos
                </a>

                <a href="resultados.html"
                class="${pagina === 'resultados.html' ? 'active' : ''}">
                Resultados
                </a>

                <a href="dicas.html"
                class="${pagina === 'dicas.html' ? 'active' : ''}">
                Dicas
                </a>

                <a href="estatisticas.html"
                class="${pagina === 'estatisticas.html' ? 'active' : ''}">
                Estatísticas
                </a>

            </div>

            <div class="nav-user">
                ${localStorage.getItem("usuarioLogado") 
                    ? `
                        <span style="margin-right:10px;">
                            Olá, ${localStorage.getItem("usuarioLogado")}
                        </span>
                        <button onclick="logout()" style="cursor:pointer;">
                             Sair
                        </button>
                     `
                    : `<a href="login.html" class="user-icon">👤</a>`
                }
            </div>

        </div>
    `;
});

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}