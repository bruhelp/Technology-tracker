import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Импорт компонентов
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Импорт страниц
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ApiDemo from './pages/ApiDemo';

// Импорт компонентов и хуков для главной страницы
import TechnologyCard from './components/TechnologyCard.jsx';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyNotes from './components/TechnologyNotes';
import SearchBox from './components/SearchBox';
import useTechnologies from './components/useTechnologies';

// === ШАГ 1 И 2 ИЗ ПДФ: ИМПОРТ MUI И ПРОВАЙДЕРОВ ===
import { AppThemeProvider } from './theme/AppThemeProvider';
import { NotificationProvider } from './context/NotificationContext';
import { Container, Box } from '@mui/material';

// Главная страница со старым функционалом
function HomePage() {
  const {
    visibleTechnologies,
    technologies,
    total,
    completed,
    inProgress,
    notStarted,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    updateStatus,
    updateNotes,
    allCompleted,
    allDeleted,
    randomTech,
    deleteTechnology,
  } = useTechnologies();

  return (
    <div>
      <ProgressHeader
        total={total}
        completed={completed}
        inProgress={inProgress}
        notStarted={notStarted}
      />

      <div className="title-row">
        <h2>Дорожная карта изучения технологий</h2>
        <QuickActions
          technologies={technologies}
          filter={filter}
          onMarkAllCompleted={allCompleted}
          onResetAll={allDeleted}
          onRandomTech={randomTech}
          onShowAll={() => setFilter('all')}
          onShowNotStarted={() => setFilter('not-started')}
          onShowInProgress={() => setFilter('in-progress')}
          onShowCompleted={() => setFilter('completed')}
        />
      </div>

      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultCount={visibleTechnologies.length}
      />

      {visibleTechnologies.map(tech => (
        <div key={tech.id} className="tech-card-wrapper">
          <TechnologyCard
            technology={tech}
            onStatusUpdate={updateStatus}
            onDelete={() => deleteTechnology(tech.id)}
          />
          <TechnologyNotes
            notes={tech.notes}
            techId={tech.id}
            onNotesChange={updateNotes}
          />
        </div>
      ))}
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    localStorage.setItem('username', user);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <AppThemeProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />

            <Container maxWidth="lg">
              <Box sx={{ py: 4 }}>
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/technologies" element={<TechnologyList />} />
                    <Route path="/technology/:techId" element={<TechnologyDetail />} />
                    <Route path="/api-demo" element={<ApiDemo />} />

                    <Route
                      path="/statistics"
                      element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                          <Statistics />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                          <Settings onLogout={handleLogout} />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
              </Box>
            </Container>
          </div>
        </Router>
      </NotificationProvider>
    </AppThemeProvider>
  );
}

export default App;