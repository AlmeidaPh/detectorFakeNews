console.log('Token no localStorage:', localStorage.getItem('token'));
console.log('Redirecionamento inicial:', window.location.pathname);

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.querySelector('input[name="remember"]');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const loginButton = document.querySelector('.btn-primary');
    const btnText = document.querySelector('.btn-text');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const successCheckmark = document.querySelector('.success-checkmark');
    const statusMessage = document.querySelector('.status-message');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    
    // Configurações
    const API_URL = 'http://localhost:5000/api/auth';
    const MIN_PASSWORD_LENGTH = 6;
     
    // Toggle para mostrar/esconder senha
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye-slash');
            this.setAttribute('aria-label', type === 'password' ? 'Mostrar senha' : 'Ocultar senha');
        });
    }
    
    // Validação em tempo real
    usernameInput.addEventListener('input', clearValidation);
    passwordInput.addEventListener('input', clearValidation);
    
    // Verificar se há usuário lembrado
    if (localStorage.getItem('rememberedUser')) {
        usernameInput.value = localStorage.getItem('rememberedUser');
        rememberCheckbox.checked = true;
        passwordInput.focus();
    }
    
    // Verificar parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('registered')) {
        showStatus('Registro realizado com sucesso! Faça login agora.', 'success');
    }
    if (urlParams.has('logout')) {
        showStatus('Você saiu da sua conta com sucesso.', 'success');
    }
    
    // Evento de submit do formulário
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (!validateForm()) return;
        
        // Preparar dados
        const loginData = {
            email: usernameInput.value.trim(),
            password: passwordInput.value
        };
        try {
            // Mostrar estado de loading
            setLoadingState(true);
            
            // Chamar API
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Credenciais inválidas');
            }
            
            // Sucesso no login
            handleLoginSuccess(data);
            
        } catch (error) {
            // Tratar erro
            handleLoginError(error);
        } finally {
            setLoadingState(false);
        }
    });
    
    // Evento para "Esqueci minha senha"
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
    
    // Funções auxiliares
    function validateForm() {
        let isValid = true;
        
        // Validar username/email
        if (usernameInput.value.trim() === '') {
            showError(usernameInput, 'Por favor, insira seu usuário ou email');
            isValid = false;
        }
        
        // Validar senha
        if (passwordInput.value === '') {
            showError(passwordInput, 'Por favor, insira sua senha');
            isValid = false;
        } else if (passwordInput.value.length < MIN_PASSWORD_LENGTH) {
            showError(passwordInput, `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`);
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('small');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function clearValidation() {
        const formGroup = this.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    function showStatus(message, type = 'error') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        if (type === 'error') {
            loginForm.classList.add('shake-animation');
            setTimeout(() => loginForm.classList.remove('shake-animation'), 500);
        }
        
        if (type !== 'loading') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    function setLoadingState(isLoading) {
        if (isLoading) {
            btnText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
            loginButton.disabled = true;
            showStatus('Autenticando...', 'loading');
        } else {
            btnText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
            loginButton.disabled = false;
        }
    }
    
    function handleLoginSuccess(data) {
    // Verificação robusta
    if (!data?.token || !data?.user) {
        console.error("Dados incompletos:", data);
        throw new Error("Resposta da API incompleta");
    }

    // Armazenamento seguro
    const userData = {
        id: data.user.id,
        username: data.user.username || 'Usuário',
        email: data.user.email
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Redirecionamento
    showStatus('Login realizado! Redirecionando...', 'success');
    setTimeout(() => window.location.href = '/index.html', 1500);
    }
    
    function handleLoginError(error) {
        showStatus(error.message, 'error');
        loginButton.classList.add('error');
        
        // Restaurar botão após 3 segundos
        setTimeout(() => {
            loginButton.classList.remove('error');
        }, 3000);
    }
    
    async function handleForgotPassword() {
        const email = prompt('Por favor, insira o email associado à sua conta:');
        if (!email) return;
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Por favor, insira um email válido');
            return;
        }
        
        try {
            showStatus('Enviando link de recuperação...', 'loading');
            
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            if (!response.ok) {
                throw new Error('Erro ao enviar email de recuperação');
            }
            
            showStatus(`Um link para redefinição de senha foi enviado para ${email}`, 'success');
            forgotPasswordLink.innerHTML = '<i class="fas fa-check"></i> Email enviado';
            forgotPasswordLink.classList.add('success');
            
            setTimeout(() => {
                forgotPasswordLink.innerHTML = '<i class="fas fa-question-circle"></i> Esqueci minha senha';
                forgotPasswordLink.classList.remove('success');
            }, 3000);
            
        } catch (error) {
            showStatus(error.message, 'error');
        }
    }
    
    function redirectToDashboard() {
        window.location.href = '/index.html';
        console.log('Redirecionando para:', '/index.html');
    }
});