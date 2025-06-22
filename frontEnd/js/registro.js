document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const registerButton = document.querySelector('.btn-primary');
    const btnText = document.querySelector('.btn-text');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const successCheckmark = document.querySelector('.success-checkmark');
    const statusMessage = document.querySelector('.status-message');
    const passwordStrength = document.querySelector('.password-strength');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    // Configurações
    const API_URL = 'http://localhost:5000/api/auth';
    const MIN_PASSWORD_LENGTH = 8;
    const USERNAME_MIN_LENGTH = 4;
    const USERNAME_MAX_LENGTH = 20;
    
    // Verificar se o usuário já está logado
    if (localStorage.getItem('token')) {
        window.location.href = '/frontEnd/screens/login.html';
    }
    
    // Toggle para mostrar/esconder senha
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.closest('.password-wrapper').querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye-slash');
            this.setAttribute('aria-label', type === 'password' ? 'Mostrar senha' : 'Ocultar senha');
        });
    });
    
    // Validação em tempo real
    nameInput.addEventListener('input', clearValidation);
    emailInput.addEventListener('input', validateEmail);
    usernameInput.addEventListener('input', validateUsername);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    termsCheckbox.addEventListener('change', clearValidation);
    
    // Evento de submit do formulário
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (!validateForm()) return;
        
        // Preparar dados
        const userData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            username: usernameInput.value.trim(),
            password: passwordInput.value
        };
        
        try {
            // Mostrar estado de loading
            setLoadingState(true);
            
            // Chamar API
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro no registro');
            }
            
            // Sucesso no registro
            handleRegisterSuccess(data);
            
        } catch (error) {
            // Tratar erro
            handleRegisterError(error);
        } finally {
            setLoadingState(false);
        }
    });
    
    // Funções auxiliares
    function validateForm() {
        let isValid = true;
        
        // Validar nome
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Por favor, insira seu nome completo');
            isValid = false;
        } else if (nameInput.value.trim().split(' ').length < 2) {
            showError(nameInput, 'Por favor, insira seu nome e sobrenome');
            isValid = false;
        }
        
        // Validar email
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Por favor, insira seu email');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'Por favor, insira um email válido');
            isValid = false;
        }
        
        // Validar username
        if (usernameInput.value.trim() === '') {
            showError(usernameInput, 'Por favor, insira um nome de usuário');
            isValid = false;
        } else if (!isValidUsername(usernameInput.value.trim())) {
            showError(usernameInput, `O nome de usuário deve ter entre ${USERNAME_MIN_LENGTH} e ${USERNAME_MAX_LENGTH} caracteres (letras, números e _)`);
            isValid = false;
        }
        
        // Validar senha
        const passwordCheck = checkPasswordStrength(passwordInput.value);
        if (passwordInput.value === '') {
            showError(passwordInput, 'Por favor, insira uma senha');
            isValid = false;
        } else if (!passwordCheck.isValid) {
            showError(passwordInput, 'A senha deve conter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números');
            isValid = false;
        }
        
        // Validar confirmação de senha
        if (confirmPasswordInput.value === '') {
            showError(confirmPasswordInput, 'Por favor, confirme sua senha');
            isValid = false;
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            showError(confirmPasswordInput, 'As senhas não coincidem');
            isValid = false;
        }
        
        // Validar termos
        if (!termsCheckbox.checked) {
            showError(termsCheckbox, 'Você deve aceitar os termos e condições');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidUsername(username) {
        const re = /^[a-zA-Z0-9_]+$/;
        return re.test(username) && 
               username.length >= USERNAME_MIN_LENGTH && 
               username.length <= USERNAME_MAX_LENGTH;
    }
    
    function checkPasswordStrength(password) {
        const hasMinLength = password.length >= MIN_PASSWORD_LENGTH;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        return {
            isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber,
            strength: hasMinLength + hasUpperCase + hasLowerCase + hasNumber
        };
    }
    
    function updatePasswordStrength(password) {
        const strength = checkPasswordStrength(password).strength;
        
        passwordStrength.className = 'password-strength';
        
        if (password.length === 0) {
            return;
        } else if (password.length < MIN_PASSWORD_LENGTH) {
            passwordStrength.classList.add('weak');
        } else if (strength < 4) {
            passwordStrength.classList.add('medium');
        } else {
            passwordStrength.classList.add('strong');
        }
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group') || input.closest('.terms-group');
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('small');
            errorElement.className = 'error-message';
            
            if (input === termsCheckbox) {
                formGroup.appendChild(errorElement);
            } else {
                const helpText = formGroup.querySelector('.help-text');
                if (helpText) {
                    helpText.insertAdjacentElement('afterend', errorElement);
                } else {
                    formGroup.appendChild(errorElement);
                }
            }
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function clearValidation() {
        const formGroup = this.closest('.form-group') || this.closest('.terms-group');
        if (formGroup) {
            formGroup.classList.remove('error');
            
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
        
        if (this === passwordInput) {
            updatePasswordStrength(this.value);
        }
    }
    
    function validateEmail() {
        if (isValidEmail(this.value.trim())) {
            clearValidation.call(this);
        }
    }
    
    function validateUsername() {
        if (isValidUsername(this.value.trim())) {
            clearValidation.call(this);
        }
    }
    
    function validatePassword() {
        const password = this.value;
        updatePasswordStrength(password);
        
        if (password && checkPasswordStrength(password).isValid) {
            clearValidation.call(this);
        }
        
        if (confirmPasswordInput.value && confirmPasswordInput.value === password) {
            clearValidation.call(confirmPasswordInput);
        }
    }
    
    function validateConfirmPassword() {
        if (this.value && this.value === passwordInput.value) {
            clearValidation.call(this);
        }
    }
    
    function showStatus(message, type = 'error') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        if (type === 'error') {
            registerForm.classList.add('shake-animation');
            setTimeout(() => registerForm.classList.remove('shake-animation'), 500);
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
            registerButton.disabled = true;
            showStatus('Registrando...', 'loading');
        } else {
            btnText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
            registerButton.disabled = false;
        }
    }
    
    function handleRegisterSuccess(data) {
        // Salvar token
        localStorage.setItem('token', data.token);
        
        // Mostrar feedback de sucesso
        showStatus('Registro realizado com sucesso! Redirecionando...', 'success');
        btnText.classList.add('hidden');
        successCheckmark.classList.remove('hidden');
        registerButton.classList.add('success');
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
            window.location.href = '/frontEnd/screens/login.html?registered=true';
        }, 2000);
    }
    
    function handleRegisterError(error) {
        showStatus(error.message, 'error');
        registerButton.classList.add('error');
        
        // Restaurar botão após 3 segundos
        setTimeout(() => {
            registerButton.classList.remove('error');
        }, 3000);
    }
});