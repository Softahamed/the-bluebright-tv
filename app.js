// ========== THEME TOGGLE ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeAuth();
    setupNotificationSystem();
    // quick diagnostic log for Firebase status
    if (typeof debugFirebase === 'function') debugFirebase();
});

// Toggle this to true after adding your Firebase config in `firebase-config.js`
// You provided a Realtime Database URL; set USE_FIREBASE true to enable remote storage.
var USE_FIREBASE = true;

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggle) themeToggle.textContent = '☀️ Light';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            themeToggle.textContent = isLight ? '☀️ Light' : '🌙 Dark';
        });
    }
}

// ========== AUTHENTICATION ==========
function initializeAuth() {
    updateAuthNavigation();
}

function updateAuthNavigation() {
    const currentUser = localStorage.getItem('currentUser');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (!authButtons) return;

    if (currentUser) {
        const user = JSON.parse(currentUser);
        authButtons.innerHTML = `
            <button class="theme-toggle" id="themeToggle">🌙 Dark</button>
            <span style="color: #ffc107; font-weight: bold;">Welcome, ${user.username}!</span>
            <button onclick="showAccountModal()" style="background: #ffc107; color: #001a4d; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Account</button>
            <button onclick="handleLogout()" style="background: #ef4444; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Logout</button>
        `;
        initializeTheme();
    } else {
        authButtons.innerHTML = `
            <button class="theme-toggle" id="themeToggle">🌙 Dark</button>
            <a href="auth.html" style="color: #ffc107; text-decoration: none; font-weight: bold; padding: 10px 15px; border: 2px solid #ffc107; border-radius: 5px;">Login / Sign Up</a>
        `;
        initializeTheme();
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
    }
}

function showAccountModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
            <h2 style="color: #ffc107; margin-bottom: 20px;">My Account</h2>
            <div style="color: #fff; line-height: 2;">
                <p><strong>Username:</strong> ${currentUser.username}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>Registered:</strong> ${currentUser.registeredDate}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; margin-top: 20px;">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// ========== NOTIFICATIONS ==========
function setupNotificationSystem() {
    // Check for updates every 30 seconds
    setInterval(checkForUpdates, 30000);
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification') || createNotificationElement();
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 4000);
}

function createNotificationElement() {
    const notif = document.createElement('div');
    notif.id = 'notification';
    notif.className = 'notification';
    document.body.appendChild(notif);
    return notif;
}

function checkForUpdates() {
    const updates = JSON.parse(localStorage.getItem('updates')) || [];
    const shownUpdates = JSON.parse(localStorage.getItem('shownUpdates')) || [];
    
    updates.forEach(update => {
        if (!shownUpdates.includes(update.id)) {
            showNotification(`🔔 ${update.message}`, 'success');
            shownUpdates.push(update.id);
        }
    });
    
    localStorage.setItem('shownUpdates', JSON.stringify(shownUpdates));
}

// ========== MODAL UTILITIES ==========
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// ========== ARTICLE/VIDEO MODAL ==========
function viewArticle(title, description, image) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
            <img src="${image}" alt="${title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #ffc107; margin-bottom: 15px;">${title}</h2>
            <p style="color: #b0b5c0; line-height: 1.6;">${description}</p>
            <button onclick="this.parentElement.parentElement.remove()" style="width: 100%; margin-top: 20px;">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// ========== ADMIN UTILITIES ==========
function getUserCount() {
    console.log('getUserCount: USE_FIREBASE=', USE_FIREBASE, 'firebase=', !!window.firebase);
    if (USE_FIREBASE && window.firebase) {
        return firebase.database().ref('users').once('value').then(snap => {
            const val = snap.val() || {};
            const count = Object.keys(val).length;
            console.log('getUserCount: remote count=', count);
            return count;
        }).catch(err => {
            console.error('getUserCount: firebase error', err);
            return 0;
        });
    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('getUserCount: local count=', users.length);
    return Promise.resolve(users.length);
}

function getAllUsers() {
    console.log('getAllUsers: USE_FIREBASE=', USE_FIREBASE, 'firebase=', !!window.firebase);
    if (USE_FIREBASE && window.firebase) {
        return firebase.database().ref('users').once('value').then(snap => {
            const val = snap.val() || {};
            const arr = Object.keys(val).map(k => val[k]);
            console.log('getAllUsers: fetched', arr.length, 'users from firebase');
            return arr;
        }).catch(err => {
            console.error('getAllUsers: firebase error', err);
            return [];
        });
    }
    const local = JSON.parse(localStorage.getItem('users')) || [];
    console.log('getAllUsers: returning local users length=', local.length);
    return Promise.resolve(local);
}

function addUpdate(message) {
    const newUpdate = {
        id: Date.now(),
        message,
        timestamp: new Date().toLocaleString()
    };
    console.log('addUpdate: USE_FIREBASE=', USE_FIREBASE);
    if (USE_FIREBASE && window.firebase) {
        return firebase.database().ref('updates/' + newUpdate.id).set(newUpdate).then(() => {
            console.log('addUpdate: saved update to firebase', newUpdate.id);
        }).catch(err => { console.error('addUpdate: firebase error', err); throw err; });
    }
    const updates = JSON.parse(localStorage.getItem('updates')) || [];
    updates.push(newUpdate);
    localStorage.setItem('updates', JSON.stringify(updates));
    return Promise.resolve();
}

// Convenience wrappers used by pages
function saveUser(user) {
    console.log('saveUser: USE_FIREBASE=', USE_FIREBASE, 'user.id=', user.id);
    if (USE_FIREBASE && window.firebase) {
        return firebase.database().ref('users/' + user.id).set(user).then(() => {
            console.log('saveUser: saved user to firebase', user.id);
        }).catch(err => { console.error('saveUser: firebase error', err); throw err; });
    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('saveUser: saved user to localStorage', user.id);
    return Promise.resolve();
}

function fetchUsers() {
    return getAllUsers();
}

// Diagnostic helper you can call from the console: window.testFirebaseStatus()
function debugFirebase() {
    console.log('debugFirebase: USE_FIREBASE=', USE_FIREBASE);
    console.log('debugFirebase: firebase loaded=', typeof firebase !== 'undefined');
    if (typeof firebase !== 'undefined') {
        console.log('debugFirebase: databaseURL=', firebase.app().options.databaseURL);
        firebase.database().ref('users').once('value').then(snap => {
            console.log('debugFirebase: users snapshot:', snap.val());
        }).catch(err => { console.error('debugFirebase: error reading users', err); });
        firebase.database().ref('updates').once('value').then(snap => {
            console.log('debugFirebase: updates snapshot:', snap.val());
        }).catch(err => { console.error('debugFirebase: error reading updates', err); });
    }
}

window.testFirebaseStatus = debugFirebase;
