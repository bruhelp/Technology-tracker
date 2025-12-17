import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotify } from '../context/NotificationContext';
import './styles/Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showNotify } = useNotify();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === 'Miku' && password === 'Hatsune') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      onLogin(username);
      navigate('/');
      showNotify(`Добро пожаловать, ${username}!`, "success");
    } else {
      alert('Неверные данные для входа. Попробуйте: Miku / Hatsune');
    }
  };

  return (
    <div className="page login-page">
      <div className="login-container">
        <h1>Вход в систему</h1>
        <p className="login-hint">Используйте: Miku / Hatsune</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Имя пользователя:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Miku"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;