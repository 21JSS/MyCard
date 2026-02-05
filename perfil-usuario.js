/**
 * Perfil de Usuario - Lógica específica
 */
document.addEventListener("DOMContentLoaded", () => {
    // Toggle Password
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#password-input');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Logout Button
    const logoutBtn = document.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
});
