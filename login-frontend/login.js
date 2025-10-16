// Valid credentials
const VALID_EMAIL = 'naman.ptk30@gmail.com';
const VALID_PASSWORD = '1718730namanA!';

// Main app URL (adjust if needed)
const MAIN_APP_URL = 'http://localhost:3000';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Social login buttons
const googleLoginBtn = document.getElementById('googleLogin');
const githubLoginBtn = document.getElementById('githubLogin');
const linkedinLoginBtn = document.getElementById('linkedinLogin');
const facebookLoginBtn = document.getElementById('facebookLogin');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }

    // Check for existing session
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        redirectToMainApp();
    }
});

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

// Form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked;

    // Clear any previous messages
    clearMessage();

    // Client-side validation
    if (!email) {
        showMessage('Please enter your email address', 'error');
        emailInput.focus();
        emailInput.parentElement.classList.add('error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        emailInput.focus();
        emailInput.parentElement.classList.add('error');
        return;
    }

    if (!password) {
        showMessage('Please enter your password', 'error');
        passwordInput.focus();
        passwordInput.parentElement.classList.add('error');
        return;
    }

    // Validate credentials
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        // Show loading state
        const submitBtn = loginForm.querySelector('.btn-login');
        submitBtn.classList.add('loading');

        // Disable form inputs
        emailInput.disabled = true;
        passwordInput.disabled = true;

        // Simulate API call delay with more realistic timing
        setTimeout(() => {
            // Save session
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('loginTime', new Date().toISOString());
            sessionStorage.setItem('userName', 'Naman Sharma');

            // Remember email if checkbox is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Show success message
            showMessage('✓ Login successful! Redirecting to SpeakSense.ai...', 'success');

            // Redirect to main app
            setTimeout(() => {
                redirectToMainApp();
            }, 1800);
        }, 1200);
    } else {
        // Show specific error message
        let errorMessage = 'Invalid email or password. Please try again.';

        if (email !== VALID_EMAIL && password === VALID_PASSWORD) {
            errorMessage = 'Email address not found. Please check and try again.';
        } else if (email === VALID_EMAIL && password !== VALID_PASSWORD) {
            errorMessage = 'Incorrect password. Please try again.';
        }

        showMessage(errorMessage, 'error');

        // Add error state to inputs
        emailInput.parentElement.classList.add('error');
        passwordInput.parentElement.classList.add('error');

        // Shake animation for error
        const loginBox = document.querySelector('.login-box');
        loginBox.style.animation = 'shake 0.5s';
        setTimeout(() => {
            loginBox.style.animation = '';
            emailInput.parentElement.classList.remove('error');
            passwordInput.parentElement.classList.remove('error');
        }, 500);

        // Clear password on failed attempt (security best practice)
        passwordInput.value = '';
        passwordInput.focus();
    }
});

// Social login handlers
googleLoginBtn.addEventListener('click', () => {
    handleSocialLogin('Google');
});

githubLoginBtn.addEventListener('click', () => {
    handleSocialLogin('GitHub');
});

linkedinLoginBtn.addEventListener('click', () => {
    handleSocialLogin('LinkedIn');
});

facebookLoginBtn.addEventListener('click', () => {
    handleSocialLogin('Facebook');
});

// Handle social login
function handleSocialLogin(provider) {
    const btn = event.target.closest('.social-btn');
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.7';

    // Add loading indicator
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span>Connecting...</span>`;

    setTimeout(() => {
        showMessage(`${provider} login is currently unavailable. Please use email/password or contact support.`, 'error');
        btn.style.pointerEvents = '';
        btn.style.opacity = '';
        btn.innerHTML = originalContent;
    }, 1500);

    // In a real application, this would redirect to OAuth provider
    console.log(`Initiating ${provider} OAuth flow...`);

    // Example implementation:
    // window.location.href = `/auth/${provider.toLowerCase()}`;
}

// Show message
function showMessage(text, type) {
    clearMessage();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} show`;
    messageDiv.textContent = text;

    loginForm.insertBefore(messageDiv, loginForm.firstChild);

    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Clear message
function clearMessage() {
    const existingMessage = loginForm.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Redirect to main app
function redirectToMainApp() {
    // Check if main app is running, otherwise show message
    console.log('Redirecting to main application...');

    // In production, you would redirect to the actual app URL
    window.location.href = MAIN_APP_URL;

    // For development, if main app is not running, show message
    // showMessage('Main application URL: ' + MAIN_APP_URL, 'success');
}

// Add shake animation CSS if not exists
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    .shake {
        animation: shake 0.5s;
    }
`;
document.head.appendChild(style);

// Handle Enter key in inputs
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        passwordInput.focus();
    }
});

// Add real-time input validation with visual feedback
emailInput.addEventListener('input', () => {
    const parent = emailInput.parentElement;
    if (emailInput.value && !isValidEmail(emailInput.value)) {
        parent.classList.add('error');
    } else {
        parent.classList.remove('error');
    }
});

emailInput.addEventListener('blur', () => {
    const parent = emailInput.parentElement;
    if (emailInput.value && !isValidEmail(emailInput.value)) {
        parent.classList.add('error');
        addInlineError(emailInput, 'Please enter a valid email address');
    } else {
        parent.classList.remove('error');
        removeInlineError(emailInput);
    }
});

emailInput.addEventListener('focus', () => {
    removeInlineError(emailInput);
});

passwordInput.addEventListener('input', () => {
    const parent = passwordInput.parentElement;
    parent.classList.remove('error');
    removeInlineError(passwordInput);
});

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add inline error message
function addInlineError(input, message) {
    removeInlineError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'inline-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff4757;
        font-size: 12px;
        margin-top: 6px;
        animation: slideDown 0.3s ease;
    `;
    input.parentElement.appendChild(errorDiv);
}

// Remove inline error message
function removeInlineError(input) {
    const existingError = input.parentElement.querySelector('.inline-error');
    if (existingError) {
        existingError.remove();
    }
}

// Logout function (can be called from main app)
function logout() {
    sessionStorage.clear();
    localStorage.removeItem('rememberedEmail');
    window.location.reload();
}

// Make logout available globally
window.logout = logout;

// Auto-focus on email input with slight delay for better UX
setTimeout(() => {
    emailInput.focus();
}, 300);

// Add professional keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to clear form
    if (e.key === 'Escape') {
        clearForm();
    }
});

// Clear form function
function clearForm() {
    emailInput.value = '';
    passwordInput.value = '';
    rememberMeCheckbox.checked = false;
    clearMessage();
    emailInput.parentElement.classList.remove('error');
    passwordInput.parentElement.classList.remove('error');
    emailInput.focus();
}

// Add visual feedback on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Password strength indicator (visual feedback)
passwordInput.addEventListener('input', () => {
    const strength = calculatePasswordStrength(passwordInput.value);
    updatePasswordStrengthIndicator(strength);
});

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
}

function updatePasswordStrengthIndicator(strength) {
    // This is just for visual feedback, not showing to user yet
    // Can be extended later if needed
    const colors = ['#ff4757', '#ffa502', '#ffd32a', '#2ecc71', '#10b981'];
    if (strength > 0) {
        passwordInput.style.borderColor = colors[strength - 1];
    }
}

console.log('%c🔐 SpeakSense.ai Login Portal', 'color: #667eea; font-size: 18px; font-weight: bold;');
console.log('%cSecure Authentication System v1.0', 'color: #764ba2; font-size: 12px;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ccc;');
console.log('%cTest Credentials:', 'color: #666; font-weight: bold;');
console.log('Email:', VALID_EMAIL);
console.log('Password: [Protected]');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ccc;');
console.log('%c© 2025 Naman Sharma. All rights reserved.', 'color: #999; font-size: 10px;');
