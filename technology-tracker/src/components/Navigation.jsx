import { Link, useLocation } from 'react-router-dom';
import './styles/Navigation.css';
import { useColorMode } from '../theme/AppThemeProvider';
import { IconButton, useTheme, Box, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function Navigation({ isLoggedIn, onLogout }) {
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Пользователь';

  const theme = useTheme();
  const colorMode = useColorMode();
  const isDark = theme.palette.mode === 'dark';

  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link to="/">
          <h2>Трекер технологий Мику</h2>
        </Link>
      </div>

      <ul className="nav-menu">
        <li>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Главная
          </Link>
        </li>

        <li>
          <Link
            to="/technologies"
            className={location.pathname.includes('/technolog') ? 'active' : ''}
          >
            Технологии
          </Link>
        </li>

        <li>
          <Link
            to="/api-demo"
            className={location.pathname === '/api-demo' ? 'active' : ''}
          >
            API
          </Link>
        </li>

        {isLoggedIn ? (
          <>
            <li>
              <Link
                to="/statistics"
                className={location.pathname === '/statistics' ? 'active' : ''}
              >
                Статистика
              </Link>
            </li>

            <li>
              <Link
                to="/settings"
                className={location.pathname === '/settings' ? 'active' : ''}
              >
                Настройки
              </Link>
            </li>
            
            <li className="user-section">
              <span className="username">👤 {username}</span>
              <button onClick={onLogout} className="logout-btn-nav">
                Выйти
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/login"
              className={location.pathname === '/login' ? 'active' : ''}
            >
              Войти
            </Link>
          </li>
        )}

        {/* КОНТЕЙНЕР ДЛЯ ПЕРЕКЛЮЧАТЕЛЯ ТЕМЫ */}
        <li style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
          <Tooltip title={isDark ? "Включить светлую тему" : "Включить темную тему"}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '10px',
                p: '2px',
                border: '1px solid',
                borderColor: isDark ? 'primary.main' : 'rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <IconButton 
                onClick={colorMode.toggleColorMode} 
                sx={{ 
                    color: isDark ? '#ffd700' : '#5c6bc0', // Золотой для солнца, индиго для луны
                    p: 1 
                }}
              >
                {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Tooltip>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;