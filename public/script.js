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

        const ano = projeto.updated_at ? projeto.updated_at.split('T')[0].split('-')[0] : '';

        let icon = '📁';

        if (projeto.language === 'JavaScript') icon = '🟨';
        if (projeto.language === 'Python')  icon = '🐍';
        if (projeto.language === 'Java') icon = '☕';
        if (projeto.language === 'TypeScript') icon = '🟦';
        if (projeto.language === 'HTML') icon = '📄';
        if (projeto.language === 'CSS') icon = '🎨';

        // Preenche com informações do projeto
        card.innerHTML = `
            <div class="projeto-header>
                <span class="projeto-icon">${icon}</span>
                <span class="projeto-ano">${ano}</span>
            </div>
            <h3>${projeto.name}</h3>
            <p>${projeto.description || "Sem descrição"}</p>
            <div class="projeto-footer">
                <span class="linguagem">${projeto.language || "Sem linguagem"}</span>
                <div class="projeto-stats">
                    <span>⭐ ${projeto.stargazers_count}</span> 
                    <span>🍴 ${projeto.forks_count}</span>
                </div>
            <a href="${projeto.html_url}" target="_blank" class="botao-projeto">
                    <i class="fab fa-github"></i>Ver no Github</a>
            `;

            // Adiciona ao container
            container.appendChild(card);
    });
}

// Quando a página carrega, busca os projetos
document.addEventListener("DOMContentLoaded", buscarProjetos);

// Função para alternar tema
const botaoTema = document.getElementById("trocar-tema");
const html = document.documentElement;

botaoTema.addEventListener("click", () => {
    const temaAtual = html.getAttribute("data-tema");
    const novoTema = temaAtual === 'escuro' ? 'claro' : 'escuro';
    html.setAttribute('data-tema', novoTema);
    localStorage.setItem('tema', novoTema);

    const icone = botaoTema.querySelector('i');
    icone.className = novoTema === 'escuro' ? 'fas fa-moon' : 'fas fa-sun';
    
})