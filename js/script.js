// ==========================
// FASES DO JOGO
// ==========================
const fases = [
    { pergunta: "Nível 1: Liste todos os usuários da tabela users.", resposta: "select * from users", tipo: "select" },
    { pergunta: "Nível 2: Liste o usuário com id igual a 1.", resposta: "select * from users where id = 1", tipo: "select" },
    { pergunta: "Nível 3: Liste os usuários ativos.", resposta: "select * from users where active = 1", tipo: "select" },
    { pergunta: "Nível 4: Insira um novo usuário chamado João.", resposta: "insert into users (name) values ('joao')", tipo: "insert" },
    { pergunta: "Nível 5: Insira um usuário ativo chamado Maria.", resposta: "insert into users (name, active) values ('maria', 1)", tipo: "insert" },
    { pergunta: "Nível 6: Atualize o nome do usuário com id 1 para Carlos.", resposta: "update users set name = 'carlos' where id = 1", tipo: "update" },
    { pergunta: "Nível 7: Desative o usuário com id 2.", resposta: "update users set active = 0 where id = 2", tipo: "update" },
    { pergunta: "Nível 8: Delete o usuário com id 3.", resposta: "delete from users where id = 3", tipo: "delete" },
    { pergunta: "Nível 9: Delete todos os usuários inativos.", resposta: "delete from users where active = 0", tipo: "delete" },

    { pergunta: "Nível 10: Liste os usuários ativos ordenados por nome.", resposta: "select * from users where active = 1 order by name", tipo: "select" },
    { pergunta: "Nível 11: Liste os usuários ordenados por id decrescente.", resposta: "select * from users order by id desc", tipo: "select" },
    { pergunta: "Nível 12: Insira um usuário chamado Ana com status inativo.", resposta: "insert into users (name, active) values ('ana', 0)", tipo: "insert" },
    { pergunta: "Nível 13: Atualize o usuário com id 4 para ativo.", resposta: "update users set active = 1 where id = 4", tipo: "update" },
    { pergunta: "Nível 14: Atualize o nome e status do usuário com id 5.", resposta: "update users set name = 'lucas', active = 1 where id = 5", tipo: "update" },
    { pergunta: "Nível 15: Delete usuários com id maior que 10.", resposta: "delete from users where id > 10", tipo: "delete" },
    { pergunta: "Nível 16: Liste usuários cujo nome seja Maria.", resposta: "select * from users where name = 'maria'", tipo: "select" },
    { pergunta: "Nível 17: Insira um usuário chamado Pedro e ative-o.", resposta: "insert into users (name, active) values ('pedro', 1)", tipo: "insert" },
    { pergunta: "Nível 18: Desative todos os usuários com id maior que 20.", resposta: "update users set active = 0 where id > 20", tipo: "update" },
    { pergunta: "Nível 19: Delete todos os usuários chamados Ana.", resposta: "delete from users where name = 'ana'", tipo: "delete" },

    { pergunta: "Nível 20: Liste os usuários ativos chamados Maria, ordenados por id decrescente.", resposta: "select * from users where active = 1 and name = 'maria' order by id desc", tipo: "select" }
];

// ==========================
// ESTADO
// ==========================
let faseAtual = 0;
let acertos = 0;
let erros = 0;

// ==========================
// ELEMENTOS
// ==========================
const output = document.getElementById("output");
const input = document.getElementById("sqlInput");
const button = document.getElementById("runBtn");
const acertosEl = document.getElementById("acertos");
const errosEl = document.getElementById("erros");

const rankingBox = document.getElementById("ranking");
const rankingList = document.getElementById("rankingList");

const playerBox = document.getElementById("playerBox");
const playerNameInput = document.getElementById("playerName");
const restartBtn = document.getElementById("restartBtn");

// ==========================
// EVENTOS
// ==========================
button.addEventListener("click", verificarResposta);
input.addEventListener("keydown", e => {
    if (e.key === "Enter") verificarResposta();
});

restartBtn.addEventListener("click", () => {
    location.reload();
});

// ==========================
// FUNÇÃO PRINCIPAL
// ==========================
function verificarResposta() {
    let comando = input.value.toLowerCase().trim();
    if (comando.endsWith(";")) comando = comando.slice(0, -1);

    const tipoDigitado = detectarTipoComando(comando);
    const tipoEsperado = fases[faseAtual].tipo;

    if (tipoDigitado !== tipoEsperado) {
        erros++;
        errosEl.textContent = erros;
        mostrarErroTipo(tipoDigitado);
        return;
    }

    if (comando === fases[faseAtual].resposta) {
        acertos++;
        acertosEl.textContent = acertos;

        output.style.color = "#00ff9c";
        output.textContent = "Query OK. Rows affected: 1";

        faseAtual++;
        input.value = "";

        if (fases[faseAtual]) {
            setTimeout(() => {
                output.textContent = fases[faseAtual].pergunta;
            }, 900);
        } else {
            finalizarJogo();
        }
    } else {
        erros++;
        errosEl.textContent = erros;
        mostrarErroSQL(comando);
    }
}

// ==========================
// FINAL DO JOGO
// ==========================
function finalizarJogo() {
    output.textContent = "🎉 Database escaped successfully.";
    input.disabled = true;
    button.disabled = true;

    playerBox.style.display = "block";
    restartBtn.style.display = "block";

    playerNameInput.focus();

    playerNameInput.addEventListener("keydown", e => {
        if (e.key === "Enter") salvarRanking();
    });
}

// ==========================
// RANKING
// ==========================
function salvarRanking() {
    const nome = playerNameInput.value.trim() || "Anônimo";
    const ranking = JSON.parse(localStorage.getItem("rankingSQL")) || [];

    ranking.push({ nome, acertos, erros });
    localStorage.setItem("rankingSQL", JSON.stringify(ranking));

    mostrarRanking();
    playerBox.style.display = "none";
}

function mostrarRanking() {
    const ranking = JSON.parse(localStorage.getItem("rankingSQL")) || [];
    ranking.sort((a, b) => b.acertos - a.acertos);

    rankingBox.style.display = "block";
    rankingList.innerHTML = "";

    ranking.forEach(j => {
        const div = document.createElement("div");
        div.className = "ranking-item";
        div.innerHTML = `👤 ${j.nome} | ✅ ${j.acertos} | ❌ ${j.erros}`;
        rankingList.appendChild(div);
    });
}

// ==========================
// SQL
// ==========================
function detectarTipoComando(sql) {
    if (sql.startsWith("select")) return "select";
    if (sql.startsWith("insert")) return "insert";
    if (sql.startsWith("update")) return "update";
    if (sql.startsWith("delete")) return "delete";
    return "desconhecido";
}

function mostrarErroTipo(tipo) {
    output.style.color = "#ff4c4c";
    output.textContent =
        tipo === "desconhecido"
            ? "ERROR 1064 (42000): Unknown SQL command"
            : `ERROR 1064 (42000): '${tipo.toUpperCase()}' is not allowed in this context`;
}

function mostrarErroSQL(comando) {
    output.style.color = "#ff4c4c";

    if (!comando.includes("from")) {
        output.textContent = "ERROR 1064 (42000): Missing FROM clause";
    } else if (!comando.includes("users")) {
        output.textContent = "ERROR 1146 (42S02): Table 'users' doesn't exist";
    } else if (comando.includes("where") && !comando.includes("=")) {
        output.textContent = "ERROR 1064 (42000): Invalid WHERE condition";
    } else {
        output.textContent = "ERROR 1064 (42000): Syntax error in SQL statement";
    }
}
