const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const AUTH_STORAGE_KEY = 'milpa_admin_auth';
const AUTH_EXPIRATION_MINUTES = 30;

function getLoginPagePath() {
    return window.location.pathname.endsWith('admin-login.html') ? 'admin-login.html' : '../Login/admin-login.html';
}

function getDashboardPagePath() {
    return window.location.pathname.endsWith('admin-login.html') ? '../Dashboard/admin-dashboard.html' : '../Dashboard/admin-dashboard.html';
}

function generateAuthToken() {
    if (window.crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    const randomValue = Math.random().toString(36).slice(2) + Date.now().toString(36);
    return btoa(randomValue).replace(/=+/g, '');
}

function getAdminAuth() {
    try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        return null;
    }
}

function isAdminAuthValid() {
    const auth = getAdminAuth();
    return Boolean(auth && auth.token && auth.expires && Date.now() < auth.expires);
}

function saveAdminAuth() {
    const expires = Date.now() + AUTH_EXPIRATION_MINUTES * 60 * 1000;
    const auth = {
        token: generateAuthToken(),
        user: ADMIN_USERNAME,
        expires,
        createdAt: Date.now()
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

function clearAdminAuth() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

function loginAdmin(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        saveAdminAuth();
        return true;
    }
    clearAdminAuth();
    return false;
}

function logoutAdmin(redirect = true) {
    clearAdminAuth();
    if (redirect) {
        window.location.replace(getLoginPagePath());
    }
}

function redirectIfAlreadyLoggedIn() {
    if (isAdminAuthValid()) {
        window.location.replace(getDashboardPagePath());
    }
}

function requireAdminSession() {
    if (!isAdminAuthValid()) {
        clearAdminAuth();
        window.location.replace(getLoginPagePath());
    }
}

function initializeAdminAuth() {
    const isLoginPage = window.location.pathname.endsWith('admin-login.html');
    if (isLoginPage) {
        redirectIfAlreadyLoggedIn();
    } else {
        requireAdminSession();
    }
}

window.addEventListener('storage', (event) => {
    if (event.key === AUTH_STORAGE_KEY) {
        const isLoginPage = window.location.pathname.endsWith('admin-login.html');
        if (!isLoginPage && !isAdminAuthValid()) {
            window.location.replace(getLoginPagePath());
        }
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdminAuth);
} else {
    initializeAdminAuth();
}
