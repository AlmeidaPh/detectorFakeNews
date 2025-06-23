localStorage.clear(); // Remove depois de usar!
console.log('LocalStorage limpo!');

console.log('Dados do localStorage:');
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));




document.getElementById('menu-button').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
});

function alternarModo() {
    const body = document.body;
    const modoAtual = body.classList.toggle('dark');
    localStorage.setItem('modo_escuro', modoAtual ? 'ativado' : 'desativado');

    const icon = document.getElementById('darkmode-icon');
    icon.src = modoAtual ? '/frontEnd/imgs/lua.svg' : '/frontEnd/imgs/sol.svg';
}

window.onload = () => {
    const modoSalvo = localStorage.getItem('modo_escuro');
    if (modoSalvo === 'ativado') {
        document.body.classList.add('dark');
        document.getElementById('darkmode-icon').src = '/frontEnd/imgs/lua.svg';
    }
};

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
            throw new Error('Erro na requisição');
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
        console.error("Erro:", error);
        alert("Ocorreu um erro ao verificar a notícia. Por favor, tente novamente.");
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const userInfo = document.getElementById('user-info');
    const loginButton = document.getElementById('login-button');
    
    // Verifica se está logado
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (token && userString) {
        try {
            const user = JSON.parse(userString);
            
            // Esconde botão de cadastro e mostra info do usuário
            if (loginButton) loginButton.style.display = 'none';
            if (userInfo) {
                userInfo.style.display = 'flex';
                const usernameDisplay = document.getElementById('username-display');
                if (usernameDisplay) {
                    usernameDisplay.textContent = user.username || 'Usuário';
                }
            }
            
            // Configura botão de logout
            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.reload();
                });
            }
        } catch (error) {
            console.error('Erro ao processar dados do usuário:', error);
            if (loginButton) loginButton.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
        }
    } else {
        if (loginButton) loginButton.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
});