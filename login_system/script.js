// Fake database (stored in browser memory)
let users = JSON.parse(localStorage.getItem('users')) || [];

// Sign Up function
function signUp() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Check if email already exists
    if (users.find(user => user.email === email)) {
        alert('Email already exists! Try signing in.');
        return;
    }

    // Add new user to the list
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Sign Up successful! Now you can sign in.');
    showSignIn();
}

// Sign In function
function signIn() {
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    // Find the user
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        document.getElementById('user-email').textContent = email;
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('signin-form').style.display = 'none';
        document.getElementById('welcome').style.display = 'block';
    } else {
        alert('Wrong email or password. Try again.');
    }
}

// Sign Out function
function signOut() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('signin-form').style.display = 'block';
    document.getElementById('welcome').style.display = 'none';
}

// Show Sign Up form
function showSignUp() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('signin-form').style.display = 'none';
    document.getElementById('welcome').style.display = 'none';
}

// Show Sign In form
function showSignIn() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('signin-form').style.display = 'block';
    document.getElementById('welcome').style.display = 'none';
}