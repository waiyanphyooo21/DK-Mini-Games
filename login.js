document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.querySelector('#loginForm input[name="username"]').value;
    const password = document.querySelector('#loginForm input[name="password"]').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        window.location.href = 'main.html';
    } else {
        alert('Invalid username or password!');
    }
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.querySelector('#signupForm input[name="name"]').value;
    const username = document.querySelector('#signupForm input[name="username"]').value;
    const password = document.querySelector('#signupForm input[name="password"]').value;
    
    if (!name || !username || !password) {
        alert('Please fill in all fields!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({ name, username, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Account created successfully! Please login.');
    document.querySelector('.toggle').checked = false; 
});
