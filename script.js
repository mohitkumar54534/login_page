document.addEventListener("DOMContentLoaded", function () {
    let loggedInUser = null;

    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const securedPage = document.getElementById('securedPage');
    const logoutButton = document.getElementById('logoutButton');
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const errorMessage = document.getElementById('errorMessage');
    const registrationTitle = document.getElementById('registrationTitle');
    const signupLink = document.getElementById('signupLink'); // Added signupLink

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const loginUsername = document.getElementById('loginUsername').value;
        const loginPassword = document.getElementById('loginPassword').value;
        const users = getUsersFromLocalStorage();
        const user = users.find(user => user.username === loginUsername && user.password === loginPassword);

        if (user) {
            loggedInUser = user;
            showSecuredPage(loggedInUser.username);
        } else {
            showError('Invalid username or password. Please try again.');
        }
    });

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const regUsername = document.getElementById('regUsername').value;
        const regPassword = document.getElementById('regPassword').value;
        const users = getUsersFromLocalStorage();

        if (users.find(user => user.username === regUsername)) {
            showError('Username is already taken. Please choose a different one.');
        } else {
            const newUser = { username: regUsername, password: regPassword };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            document.getElementById('regUsername').value = '';
            document.getElementById('regPassword').value = '';
            loggedInUser = newUser;
            showSecuredPage(loggedInUser.username);
        }
    });

    signupLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registrationForm.classList.remove('hidden');
        registrationTitle.style.display = 'block';
        signupLink.style.display = 'none';
    });

    logoutButton.addEventListener('click', function () {
        logout();
    });

    deleteAccountButton.addEventListener('click', function () {
        if(confirm("Really want to delete it!")){
        if (loggedInUser) {
            const users = getUsersFromLocalStorage();
            const updatedUsers = users.filter(user => user.username !== loggedInUser.username);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            localStorage.removeItem('loggedInUser');
            loggedInUser = null;
            logout();
        } else {
            showError('User not logged in.');
        }
    }
    });

    function getUsersFromLocalStorage() {
        const usersJSON = localStorage.getItem('users');
        return usersJSON ? JSON.parse(usersJSON) : [];
    }

    function showSecuredPage(username) {
        loginForm.classList.add('hidden');
        registrationForm.classList.add('hidden');
        securedPage.classList.remove('hidden');
        securedPage.querySelector('h2').textContent = `Welcome to the Secured Page, ${username}!`;
        registrationTitle.style.display = 'none';
        document.querySelector('h2').style.display = 'none';
    }

    function logout() {
        loginForm.classList.remove('hidden');
        registrationForm.classList.add('hidden');
        securedPage.classList.add('hidden');
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('regUsername').value = '';
        document.getElementById('regPassword').value = '';
        errorMessage.textContent = '';
        registrationTitle.style.display = 'block';
        document.querySelector('h2').style.display = 'block';
        signupLink.style.display = 'block'; // Show the "Sign up" link
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.textContent = '';
            errorMessage.classList.add('hidden');
        }, 3000);
    }
});