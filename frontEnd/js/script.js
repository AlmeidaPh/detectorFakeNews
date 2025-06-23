// Menu Mobile
document.getElementById('menu-button').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
});

// Dark Mode
function alternarModo() {
    const body = document.body;
    const modoAtual = body.classList.toggle('dark');
    localStorage.setItem('modo_escuro', modoAtual ? 'ativado' : 'desativado');

    const icon = document.getElementById('darkmode-icon');
    if (icon) {
        icon.src = modoAtual ? '/frontEnd/imgs/lua.svg' : '/frontEnd/imgs/sol.svg';
    }
}

// Verificação de Fake News
async function verificarFakeNews() {
    const texto = document.getElementById("texto").value;

    if (!texto.trim()) {
        alert("Por favor, insira um texto para verificar.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/prever", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ texto: texto })
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }

        const data = await response.json();

        document.getElementById("veredito").innerText = `Veredito: ${data.veredito}`;
        document.getElementById("explicacao").innerText = `Explicação: ${data.explicacao_natural}`;

        const palavrasList = document.getElementById("palavras-chave");
        palavrasList.innerHTML = "";

        for (const [palavra, peso] of Object.entries(data.palavras_chave)) {
            const li = document.createElement("li");
            li.innerText = `${palavra} (peso: ${peso.toFixed(2)})`;
            palavrasList.appendChild(li);
        }

        document.getElementById("result").style.display = "block";
        document.getElementById("result").scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error("Erro na verificação:", error);
        alert("Ocorreu um erro ao verificar a notícia. Por favor, tente novamente.");
    }
}

// Gerenciamento de Usuário e Sessão
function carregarModoSalvo() {
    const modoSalvo = localStorage.getItem('modo_escuro');
    const darkIcon = document.getElementById('darkmode-icon');
    
    if (modoSalvo === 'ativado' && darkIcon) {
        document.body.classList.add('dark');
        darkIcon.src = '/frontEnd/imgs/lua.svg';
    } else if (darkIcon) {
        darkIcon.src = '/frontEnd/imgs/sol.svg';
    }
}

function configurarLogout() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/'; // Redireciona para a página inicial
        });
    }
}

function exibirInfoUsuario(user) {
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    
    if (userInfo && usernameDisplay) {
        usernameDisplay.textContent = user.username || 'Usuário';
        userInfo.style.display = 'flex';
    }
}

function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (!token || !userString) {
        return false;
    }

    try {
        const user = JSON.parse(userString);
        if (!user || (!user.username && !user.email)) {
            console.error('Dados do usuário incompletos');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return false;
        }
        return user;
    } catch (error) {
        console.error('Erro ao analisar dados do usuário:', error);
        return false;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Debug: Verifica estado inicial
    console.log('Estado do localStorage:', {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user')
    });

    // Configurações iniciais
    carregarModoSalvo();
    configurarLogout();

    // Verificação de login
    const user = verificarAutenticacao();
    const loginButton = document.getElementById('login-button');
    const userInfo = document.getElementById('user-info');

    if (user) {
        exibirInfoUsuario(user);
        if (loginButton) loginButton.style.display = 'none'; // Esconde o botão de cadastro
        if (userInfo) userInfo.style.display = 'flex'; // Mostra a info do usuário
    } else {
        if (loginButton) {
            loginButton.style.display = 'block';
            // Adiciona event listener para o botão de cadastro
            loginButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/frontEnd/screens/registro.html';
            });
        }
        if (userInfo) userInfo.style.display = 'none';
    }

    // Event Listener para o botão de verificação
    const verificarBtn = document.querySelector('.buttons button'); // Atualizado para o seletor correto
    if (verificarBtn) {
        verificarBtn.addEventListener('click', verificarFakeNews);
    }
});

// Event Listener para o Dark Mode
const darkModeToggle = document.getElementById('darkmode-toggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', alternarModo);
}