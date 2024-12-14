// Handle registration
document.querySelector('#registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        name: e.target.name.value,
        phone: e.target.phone.value,
        email: e.target.email.value,
        password: e.target.password.value
    };

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    alert(await response.text());
    if (response.ok) window.location.href = 'login.html';
});

// Handle login
document.querySelector('#loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        email: e.target.email.value,
        password: e.target.password.value
    };

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        alert(await response.text());
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password.');
    }
});



// Check if we're on the dashboard page before fetching user profile
if (window.location.pathname === '/dashboard.html') {
    window.addEventListener('DOMContentLoaded', async () => {
        // Fetch user profile only on the dashboard page
        const response = await fetch('/api/profile');
        if (response.ok) {
            const user = await response.json();
            // Update the dashboard with user info
            document.getElementById('userName').textContent = user.name;
            document.getElementById('displayName').textContent = user.name;
            document.getElementById('displayPhone').textContent = user.phone;
            document.getElementById('displayEmail').textContent = user.email;
            
            // Pre-fill the update form with current user data
            document.getElementById('name').value = user.name;
            document.getElementById('phone').value = user.phone;
            document.getElementById('password').value = user.password;
        } else {
            alert('You need to log in first.');
            window.location.href = 'login.html';
        }
    });
}

// Handle profile update

document.querySelector('#updateProfileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        id: 1,  // Replace with dynamic user ID from session
        name: e.target.name.value,
        phone: e.target.phone.value,
        password: e.target.password.value
    };

    const response = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    alert(await response.text());
});

// Handle logout
document.querySelector('#logout')?.addEventListener('click', async () => {
    const response = await fetch('/api/logout', {
        method: 'POST'
    });

    if (response.ok) {
        window.location.href = 'index.html';
    } else {
        alert('Error logging out');
    }
});