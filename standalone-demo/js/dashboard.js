// Check if user is logged in
window.addEventListener('load', function() {
    const userData = localStorage.getItem('demoUser');

    if (!userData) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
    } else {
        const user = JSON.parse(userData);
        document.querySelector('.welcome-text').textContent = `Welcome, ${user.name}!`;
    }

    // Show demo notice modal automatically
    showDemoNotice();
});

// Show demo notice modal
function showDemoNotice() {
    const modal = document.getElementById('demoNotice');
    modal.style.display = 'flex';
}

// Close demo notice modal
function closeModal() {
    const modal = document.getElementById('demoNotice');
    modal.style.display = 'none';
}

// Handle logout
function logout() {
    if (confirm('Are you sure you want to logout from the demo?')) {
        localStorage.removeItem('demoUser');
        window.location.href = 'index.html';
    }
}

// Close modal when clicking outside
document.getElementById('demoNotice').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Add animation to stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.gauge-item, .analytics-panel, .feedback-panel').forEach(el => {
    observer.observe(el);
});

// Animate filler word bars
setTimeout(() => {
    document.querySelectorAll('.filler-item .bar').forEach(bar => {
        bar.style.width = bar.style.width;
    });
}, 500);

// Add SVG gradient for circular progress
const svgNS = "http://www.w3.org/2000/svg";
const defs = document.createElementNS(svgNS, "defs");
const gradient = document.createElementNS(svgNS, "linearGradient");
gradient.setAttribute("id", "gradient");

const stop1 = document.createElementNS(svgNS, "stop");
stop1.setAttribute("offset", "0%");
stop1.setAttribute("stop-color", "#38bdf8");

const stop2 = document.createElementNS(svgNS, "stop");
stop2.setAttribute("offset", "100%");
stop2.setAttribute("stop-color", "#8b5cf6");

gradient.appendChild(stop1);
gradient.appendChild(stop2);
defs.appendChild(gradient);

const svg = document.querySelector('.circular-progress svg');
if (svg) {
    svg.insertBefore(defs, svg.firstChild);
}
