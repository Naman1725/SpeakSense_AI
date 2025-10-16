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

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Store user data with actual name
    const userData = {
        email: email,
        name: name, // Use actual user's name
        loginTime: new Date().toISOString(),
        remember: remember,
        provider: 'email'
    };

    localStorage.setItem('demoUser', JSON.stringify(userData));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
});

// OAuth Configuration (Demo - in production use real OAuth)
const oauthConfig = {
    google: {
        clientId: 'YOUR_GOOGLE_CLIENT_ID',
        name: prompt('Enter your name for Google login:') || 'Google User'
    },
    github: {
        clientId: 'YOUR_GITHUB_CLIENT_ID',
        name: prompt('Enter your name for GitHub login:') || 'GitHub User'
    },
    linkedin: {
        clientId: 'YOUR_LINKEDIN_CLIENT_ID',
        name: prompt('Enter your name for LinkedIn login:') || 'LinkedIn User'
    },
    facebook: {
        clientId: 'YOUR_FACEBOOK_APP_ID',
        name: prompt('Enter your name for Facebook login:') || 'Facebook User'
    }
};

// Handle social login
function socialLogin(provider) {
    // Get user's name via prompt (in demo mode)
    const userName = oauthConfig[provider].name;

    // Store user data with actual name from OAuth
    const userData = {
        email: `${userName.toLowerCase().replace(/\s+/g, '.')}@${provider}.com`,
        name: userName,
        provider: provider,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('demoUser', JSON.stringify(userData));

    // Show loading animation
    const btn = event.target.closest('.social-btn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Connecting...</span>';
    btn.disabled = true;

    // Simulate OAuth authentication delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);

    /*
    // PRODUCTION OAUTH CODE (uncomment for real implementation):

    if (provider === 'google') {
        // Google OAuth 2.0
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${oauthConfig.google.clientId}` +
            `&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard.html')}` +
            `&response_type=token` +
            `&scope=profile email`;
        window.location.href = googleAuthUrl;
    }
    else if (provider === 'github') {
        // GitHub OAuth
        const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
            `client_id=${oauthConfig.github.clientId}` +
            `&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard.html')}` +
            `&scope=user:email`;
        window.location.href = githubAuthUrl;
    }
    else if (provider === 'linkedin') {
        // LinkedIn OAuth 2.0
        const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
            `response_type=code` +
            `&client_id=${oauthConfig.linkedin.clientId}` +
            `&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard.html')}` +
            `&scope=r_liteprofile r_emailaddress`;
        window.location.href = linkedinAuthUrl;
    }
    else if (provider === 'facebook') {
        // Facebook OAuth
        const facebookAuthUrl = `https://www.facebook.com/v12.0/dialog/oauth?` +
            `client_id=${oauthConfig.facebook.clientId}` +
            `&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard.html')}` +
            `&scope=email,public_profile`;
        window.location.href = facebookAuthUrl;
    }
    */
}

// Handle guest login
function enterAsGuest() {
    // Create guest user data
    const userData = {
        email: 'guest@speaksense.ai',
        name: 'Guest User',
        loginTime: new Date().toISOString(),
        provider: 'guest'
    };

    localStorage.setItem('demoUser', JSON.stringify(userData));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
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
