document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;

        if (!email || !senha) {
            alert('Preencha todos os campos');
            return;
        }

        try {
            const usuario = await buscarUsuarioPorEmail(email);
            if (!usuario) {
                alert('Usuário não encontrado. Cadastre-se.');
                return;
            }

            if (usuario.senha !== senha) {
                alert('Senha incorreta');
                return;
            }

            localStorage.setItem("usuarioLogado", usuario.nome);
            window.location.href = 'calculos.html';
        } catch (err) {
            console.error(err);
            alert(err.message || 'Erro ao fazer login');
        }
        
    });
});


