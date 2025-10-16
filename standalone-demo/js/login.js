// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Store demo user data
    const userData = {
        email: email,
        name: 'Demo User',
        loginTime: new Date().toISOString(),
        remember: remember
    };

    localStorage.setItem('demoUser', JSON.stringify(userData));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
});

// Handle social login
function socialLogin(provider) {
    // Store demo user data
    const userData = {
        email: `demo@${provider}.com`,
        name: 'Demo User',
        provider: provider,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('demoUser', JSON.stringify(userData));

    // Show loading animation
    const btn = event.target.closest('.social-btn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Connecting...</span>';
    btn.disabled = true;

    // Simulate authentication delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Handle signup link
function showSignup(e) {
    e.preventDefault();
    alert('This is a demo version. In the full application, you can create an account with detailed profile information including your name, age, profession, speaking experience, and communication goals.');
}

// Add smooth animations on page load
window.addEventListener('load', function() {
    document.querySelector('.login-card').classList.add('loaded');
});
