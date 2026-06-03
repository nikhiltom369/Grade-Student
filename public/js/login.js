document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#password');
    const loginBtn = document.getElementById('loginBtn');

    // Password visibility toggle
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('bi-eye-fill');
        this.classList.toggle('bi-eye-slash-fill');
    });

    // Check if already logged in
    fetch('/api/auth/status')
        .then(res => res.json())
        .then(data => {
            if (data.loggedIn) {
                window.location.href = '/addStudent.html';
            }
        });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = passwordInput.value;

        loginBtn.disabled = true;
        loginBtn.innerText = 'Logging in...';

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();

            if (response.ok && data.success) {
                window.location.href = '/addStudent.html';
            } else {
                alertBox.classList.remove('d-none');
                alertMessage.innerText = data.error || 'Invalid credentials';
            }
        } catch (error) {
            alertBox.classList.remove('d-none');
            alertMessage.innerText = 'Server error. Please try again later.';
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerText = 'Login';
        }
    });

    // Prevent going back to this page after login
    window.history.forward();
    function noBack() { window.history.forward(); }
});
