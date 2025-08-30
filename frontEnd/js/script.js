// Menu Mobile
document.getElementById('menu-button').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
});

// Dark Mode
function alternarModo() {
    const body = document.body;
    const modoEscuroAtivo = body.classList.toggle('dark');
    localStorage.setItem('modo_escuro', modoEscuroAtivo ? 'ativado' : 'desativado');

    const icon = document.getElementById('darkmode-icon');
    icon.src = modoEscuroAtivo ? '/frontEnd/imgs/lua.svg' : '/frontEnd/imgs/sol.svg';
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

    if (modoSalvo === 'ativado') {
        document.body.classList.add('dark');
        if (darkIcon) darkIcon.src = '/frontEnd/imgs/lua.svg';
    } else {
        document.body.classList.remove('dark');
        if (darkIcon) darkIcon.src = '/frontEnd/imgs/sol.svg';
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
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) return false;

    const user = JSON.parse(userData);
    return user?.id ? user : false;
    
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
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
    const registerButton = document.getElementById('register-button'); // Novo
    const userInfo = document.getElementById('user-info');

    if (user) {
        exibirInfoUsuario(user);
        if (loginButton) loginButton.style.display = 'none';
        if (registerButton) registerButton.style.display = 'none'; // Esconde ambos se logado
        if (userInfo) userInfo.style.display = 'flex';
    } else {
        if (loginButton) {
            loginButton.style.display = 'block';
            loginButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/frontEnd/screens/login.html';
            });
        }
        if (registerButton) {
            registerButton.style.display = 'block';
            registerButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/frontEnd/screens/registro.html';
            });
        }
        if (userInfo) userInfo.style.display = 'none';
    }

    // Event Listener para o botão de verificação
    const verificarBtn = document.querySelector('.buttons button');
    if (verificarBtn) {
        verificarBtn.addEventListener('click', verificarFakeNews);
    }

    // Event Listener para o Dark Mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', alternarModo);
    }
});

    // Acessibilidade - Controles de Fonte e Visual
    document.addEventListener('DOMContentLoaded', function() {
        // Elementos da acessibilidade
        const accessibilityToggle = document.getElementById('accessibility-toggle');
        const accessibilityOptions = document.getElementById('accessibility-options');
        const closeAccessibility = document.getElementById('close-accessibility');
        const fontButtons = document.querySelectorAll('.font-btn');
        const fontTypeButtons = document.querySelectorAll('.font-type-btn');
        const toggleImages = document.getElementById('toggle-images');
        
        // Alternar visibilidade das opções de acessibilidade
        if (accessibilityToggle && accessibilityOptions) {
            accessibilityToggle.addEventListener('click', function() {
                accessibilityOptions.classList.toggle('active');
            });
        }
        
        // Fechar opções de acessibilidade
        if (closeAccessibility) {
            closeAccessibility.addEventListener('click', function() {
                accessibilityOptions.classList.remove('active');
            });
        }
        
        // Controles de tamanho de fonte
        fontButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                changeFontSize(action);
            });
        });
        
        // Controles de tipo de fonte
        fontTypeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const fontType = this.getAttribute('data-font');
                changeFontType(fontType);
            });
        });
        
        // Ocultar/mostrar imagens
        if (toggleImages) {
            toggleImages.addEventListener('change', function() {
                document.body.classList.toggle('hide-images', this.checked);
                localStorage.setItem('hide_images', this.checked);
            });
        }
        
        // Carregar preferências salvas
        loadAccessibilityPreferences();
    });

    // Função para alterar o tamanho da fonte
    function changeFontSize(action) {
        const body = document.body;
        
        // Remover classes de tamanho existentes
        body.classList.remove('font-small', 'font-large', 'font-xlarge');
        
        // Aplicar novo tamanho baseado na ação
        switch(action) {
            case 'decrease':
                body.classList.add('font-small');
                localStorage.setItem('font_size', 'small');
                break;
            case 'increase':
                body.classList.add('font-large');
                localStorage.setItem('font_size', 'large');
                break;
            case 'reset':
            default:
                localStorage.setItem('font_size', 'normal');
                break;
        }
    }

    // Função para alterar o tipo de fonte
    function changeFontType(fontType) {
        const body = document.body;
        
        // Remover classes de tipo de fonte existentes
        body.classList.remove('font-dyslexic', 'font-high-contrast');
        
        // Aplicar novo tipo de fonte
        switch(fontType) {
            case 'dyslexic':
                body.classList.add('font-dyslexic');
                localStorage.setItem('font_type', 'dyslexic');
                break;
            case 'high-contrast':
                body.classList.add('font-high-contrast');
                localStorage.setItem('font_type', 'high-contrast');
                break;
            case 'default':
            default:
                localStorage.setItem('font_type', 'default');
                break;
        }
    }

    // Função para carregar preferências salvas
    function loadAccessibilityPreferences() {
        // Carregar tamanho da fonte
        const fontSize = localStorage.getItem('font_size');
        if (fontSize) {
            changeFontSize(fontSize === 'small' ? 'decrease' : 
                        fontSize === 'large' ? 'increase' : 'reset');
        }
        
        // Carregar tipo de fonte
        const fontType = localStorage.getItem('font_type');
        if (fontType) {
            changeFontType(fontType);
        }
        
        // Carregar preferência de ocultar imagens
        const hideImages = localStorage.getItem('hide_images') === 'true';
        if (hideImages) {
            document.getElementById('toggle-images').checked = true;
            document.body.classList.add('hide-images');
        }
    }

    // Adicionar estilos para ocultar imagens
    const hideImagesStyle = document.createElement('style');
    hideImagesStyle.textContent = `
        body.hide-images img {
            display: none !important;
        }
    `;
    document.head.appendChild(hideImagesStyle);