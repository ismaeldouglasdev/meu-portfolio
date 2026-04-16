const username = "ismaeldouglasdev";

// Função para buscar projetos do GitHub
async function buscarProjetos() {
    try {
        // Busca os repositórios do usuário
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);

        if (!response.ok) {
            throw new Error("Erro ao buscar projetos");
        }

        const projetos = await response.json();
        exibirProjetos(projetos);
    } catch (erro) {
        console.error("Erro:", erro);
        document.getElementById("lista-projetos").innerHTML = "<p>Erro ao carregar projetos</p>";
    }
}

// Função para exibir s projetos na tela
function exibirProjetos(projetos) {
    const container = document.getElementById("lista-projetos");

    // Limpa o container
    container.innerHTML = "";

    // Para cada proejeto, cria um card
    projetos.forEach(projeto => {
        const card = document.createElement("div");
        card.className = "projeto";

        // Preenche com informações do projeto
        card.innerHTML = `
            <h3>${projeto.name}</h3>
            <p>${projeto.description || "Sem descrição"}</p>
            <p class="linguagem">${projeto.language || "Sem linguagem"}</p>
            <p>⭐ ${projeto.stargazers_count} | 🍴 ${projeto.forks_count}</p>
            <a href="${projeto.html_url}" target="_blank" style="color: #094560;">Ver no Github</a>
            `;

            // Adiciona ao container
            container.appendChild(card);
    });
}

// Quando a página carrega, busca os projetos
document.addEventListener("DOMContentLoaded", buscarProjetos);