document
  .getElementById('loginForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:4000/users/login', {
        // Endereço correto da rota
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token); // Armazena o token
        window.location.href = '/painel.html'; // Redireciona para painel
      } else {
        alert(result.message || 'Login failed'); // Exibe mensagem de erro
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  });

