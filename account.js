window.onload = function() {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    // Get user information
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let name = '';

    // Find user's name
    for (const user of users) {
        if (user.username === username) {
            name = user.name;
            break;
        }
    }

    // Display user information
    document.getElementById('username').textContent = username;
    document.getElementById('name').textContent = name;

    // Logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });
}
