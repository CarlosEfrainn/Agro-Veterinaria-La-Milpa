document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');
    const usuarioInput = document.getElementById('input-usuario');
    const contrasenaInput = document.getElementById('input-contrasena');
    const loginButton = document.getElementById('btn-ingresar');

    if (!form || !usuarioInput || !contrasenaInput || !loginButton) {
        return;
    }

    function showError(message) {
        alert(message);
    }

    function handleLogin(event) {
        if (event) {
            event.preventDefault();
        }

        const usuario = usuarioInput.value.trim();
        const contrasena = contrasenaInput.value.trim();

        if (!usuario || !contrasena) {
            showError('Debes completar usuario y contraseña.');
            return;
        }

        const success = loginAdmin(usuario, contrasena);
        if (!success) {
            showError('Usuario o contraseña incorrectos.');
            return;
        }

        window.location.replace('../Dashboard/admin-dashboard.html');
    }

    form.addEventListener('submit', handleLogin);
    loginButton.addEventListener('click', handleLogin);
    usuarioInput.focus();
});
