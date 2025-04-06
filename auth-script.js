// Form Toggle Functionality
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.add('active');
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('hidden');
    signupForm.classList.remove('active');
});

// Password Toggle Functionality
function togglePassword(id) {
    const passwordInput = document.getElementById(id);
    const toggleButton = passwordInput.nextElementSibling;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = 'Show';
    }
}

// Alert Function
function showAlert(message, type) {
    const alertEl = document.getElementById('alert');
    alertEl.textContent = message;
    alertEl.className = `alert alert-${type}`;
    alertEl.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertEl.style.display = 'none';
    }, 5000);
}

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Basic validation (replace with actual authentication logic)
    if (email && password) {
        showAlert('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'Dashboard.html';
        }, 1500);
    } else {
        showAlert('Please enter both email and password', 'danger');
    }
});

// Signup Form Submission
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Basic validation
    if (password !== confirmPassword) {
        showAlert("Passwords don't match. Please try again.", 'danger');
        return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        showAlert('Password must be at least 8 characters and include letters, numbers, and special characters.', 'danger');
        return;
    }

    // If all validations pass
    showAlert('Account created successfully! Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = 'Dashboard.html';
    }, 1500);
});
