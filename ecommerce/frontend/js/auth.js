// Update navbar based on login state
function updateNavbar() {
  const user = getUser();
  const navAuth = document.getElementById('nav-auth');
  if (!navAuth) return;

  if (user) {
    navAuth.innerHTML = `
      <li><span style="color:#64748b">Hi, ${user.name}</span></li>
      ${user.role === 'admin' ? '<li><a href="/admin/dashboard.html">Admin</a></li>' : ''}
      <li><a href="#" onclick="logout()">Logout</a></li>
    `;
  } else {
    navAuth.innerHTML = `
      <li><a href="/login.html">Login</a></li>
      <li><a href="/register.html" class="btn-nav">Register</a></li>
    `;
  }
}

// Login form
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await api.post('/auth/login', { email, password });

    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      showToast('Login successful!');
      setTimeout(() => {
        window.location.href = res.user.role === 'admin' ? '/admin/dashboard.html' : '/';
      }, 500);
    } else {
      showToast(res.message || 'Login failed', 'error');
    }
  });
}

// Register form
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await api.post('/auth/register', { name, email, password });

    if (res.message === 'Registered successfully') {
      showToast('Registered! Please login.');
      setTimeout(() => window.location.href = '/login.html', 1000);
    } else {
      showToast(res.message || 'Register failed', 'error');
    }
  });
}