const SUPABASE_URL = "https://bspkjudnjudnyqbcwcpr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ATy-unUqRV9vZZCkKBggzw_Rm-GI9sN";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getUsuario() {
    const s = localStorage.getItem("ecowatt_usuario");
    return s ? JSON.parse(s) : null;
}

function setUsuario(u) {
    localStorage.setItem("ecowatt_usuario", JSON.stringify({
        id: u.id,
        nome: u.nome,
        email: u.email
    }));
}

// --- Usuario ---
async function cadastrarUsuario(nome, email, senha) {
    const { data, error } = await db.from("Usuario").insert({ nome, email, senha }).select().single();
    if (error) throw error;
    return data;
}

async function buscarUsuarioPorEmail(email) {
    const { data, error } = await db.from("Usuario").select("*").eq("email", email).maybeSingle();
    if (error) throw error;
    return data;
}

// --- Calculo ---
async function salvarCalculo(dispositivo, potencia, tempoUso, tempoUsoIA, diasUso, valorKwh, idUsuario) {
    const { data, error } = await db.from("Calculo").insert({
        dispositivo,
        potencia,
        tempoUso,
        tempoUsoIA,
        diasUso,
        valorKwh,
        idUsuario
    }).select().single();
    if (error) throw error;
    return data;
}

async function listarCalculos(idUsuario) {
    const { data, error } = await db.from("Calculo")
        .select("*")
        .eq("idUsuario", idUsuario)
        .order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
}

function consumoKwh(c) {
    const aparelho = (c.potencia * c.tempoUso * c.diasUso) / 1000;
    const ia = c.tempoUsoIA * c.diasUso * 0.02;
    return aparelho + ia;
}

function consumoAparelhoKwh(c) {
    return (c.potencia * c.tempoUso * c.diasUso) / 1000;
}

function consumoIaKwh(c) {
    return c.tempoUsoIA * c.diasUso * 0.02;
}

// Busca no Supabase e soma kWh por mês
async function consumoPorMes(idUsuario) {
    const lista = await listarCalculos(idUsuario);
    const meses = {};

    for (const c of lista) {
        const d = new Date(c.created_at);
        const chave = d.getFullYear() + "-" + (d.getMonth() + 1);
        if (!meses[chave]) {
            meses[chave] = {
                label: d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
                kwh: 0
            };
        }
        meses[chave].kwh += consumoKwh(c);
    }

    const ordem = Object.keys(meses).sort();
    return {
        labels: ordem.map(function (k) { return meses[k].label; }),
        valores: ordem.map(function (k) { return Number(meses[k].kwh.toFixed(2)); })
    };
}

function metricasCalculos(lista) {
    let consumoTotal = 0;
    let custo = 0;
    let aparelho = 0;
    let ia = 0;

    for (const c of lista) {
        const kwh = consumoKwh(c);
        consumoTotal += kwh;
        custo += kwh * c.valorKwh;
        aparelho += consumoAparelhoKwh(c);
        ia += consumoIaKwh(c);
    }

    const co2 = consumoTotal * 0.084;
    const arvores = co2 / 21;

    return { consumoTotal, custo, co2, arvores, aparelho, ia };
}

function consumoPorDispositivo(lista) {
    const grupos = {};
    let iaTotal = 0;

    for (const c of lista) {
        const nome = (c.dispositivo || "Dispositivo sem nome").trim() || "Dispositivo sem nome";

        if (!grupos[nome]) {
            grupos[nome] = 0;
        }

        grupos[nome] += consumoAparelhoKwh(c);
        iaTotal += consumoIaKwh(c);
    }

    const labels = Object.keys(grupos);
    const valores = labels.map(function (nome) {
        return Number(grupos[nome].toFixed(2));
    });

    labels.push("Uso de IA");
    valores.push(Number(iaTotal.toFixed(2)));

    return { labels, valores };
}

// Cadastro (página cadastrar.html)
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("main form");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nome = form.txtNome.value.trim();
        const email = form.txtLogin.value.trim();
        const senha = form.txtSenha.value;

        try {
            const existe = await buscarUsuarioPorEmail(email);
            if (existe) {
                alert("Este e-mail já está cadastrado.");
                return;
            }
            const usuario = await cadastrarUsuario(nome, email, senha);
            setUsuario(usuario);
            alert("Cadastro realizado!");
            window.location.href = "calculos.html";
        } catch (err) {
            alert(err.message || "Erro ao cadastrar.");
        }
    });
});
