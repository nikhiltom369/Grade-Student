document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addStudentForm');
    const successAlert = document.getElementById('successAlert');
    const successMessage = document.getElementById('successMessage');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Logout logic
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login.html';
        });
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Bootstrap validation
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        form.classList.add('was-validated');
        
        // Hide alerts
        successAlert.classList.add('d-none');
        errorAlert.classList.add('d-none');
        
        // Gather data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';

        try {
            const response = await fetch('/api/students/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                successAlert.classList.remove('d-none');
                successMessage.innerText = result.message;
                form.reset();
                form.classList.remove('was-validated');
            } else {
                if (response.status === 401) {
                    window.location.href = '/login.html';
                    return;
                }
                errorAlert.classList.remove('d-none');
                errorMessage.innerText = result.error || 'Failed to save student';
            }
        } catch (error) {
            errorAlert.classList.remove('d-none');
            errorMessage.innerText = 'Server error. Please try again later.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-save me-1"></i> Save Record';
        }
    });

    // Prevent back button after logout
    window.history.forward();
    function noBack() { window.history.forward(); }
});
