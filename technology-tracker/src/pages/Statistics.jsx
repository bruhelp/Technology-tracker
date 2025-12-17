import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import './styles/Statistics.css';

function Statistics() {
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  const stats = useMemo(() => {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    const inProgress = technologies.filter(t => t.status === 'in-progress').length;
    const notStarted = technologies.filter(t => t.status === 'not-started').length;
    
    const completedPercent = total ? Math.round((completed / total) * 100) : 0;
    const inProgressPercent = total ? Math.round((inProgress / total) * 100) : 0;
    const notStartedPercent = total ? Math.round((notStarted / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      completedPercent,
      inProgressPercent,
      notStartedPercent,
    };
  }, [technologies]);

  // Данные для визуализации прогресса по каждой технологии
  const techProgress = useMemo(() => {
    return technologies.map(tech => ({
      title: tech.title,
      status: tech.status,
      hasNotes: tech.notes && tech.notes.length > 0,
    }));
  }, [technologies]);

  return (
    <div className="page statistics-page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">← Назад к списку</Link>
        <h1>Статистика изучения</h1>
      </div>

      {/* Общая статистика */}
      <div className="stats-overview">
        <div className="stat-card completed-card">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <h3>Завершено</h3>
            <p className="stat-number">{stats.completed}</p>
            <p className="stat-percent">{stats.completedPercent}%</p>
          </div>
        </div>

        <div className="stat-card in-progress-card">
          <div className="stat-icon">⧖</div>
          <div className="stat-info">
            <h3>В процессе</h3>
            <p className="stat-number">{stats.inProgress}</p>
            <p className="stat-percent">{stats.inProgressPercent}%</p>
          </div>
        </div>

        <div className="stat-card not-started-card">
          <div className="stat-icon">𒊹</div>
          <div className="stat-info">
            <h3>Не начато</h3>
            <p className="stat-number">{stats.notStarted}</p>
            <p className="stat-percent">{stats.notStartedPercent}%</p>
          </div>
        </div>
      </div>

      {/* Общий прогресс */}
      <div className="progress-section">
        <h2>Общий прогресс</h2>
        <div className="progress-details">
          <span>Завершено технологий</span>
          <span className="progress-text">{stats.completed} из {stats.total}</span>
        </div>
        <ProgressBar
          progress={stats.completedPercent}
          color="#f18daf"
          height={30}
          animated
        />
      </div>

      {/* Мотивационное сообщение */}
      <div className="motivation-section">
        {stats.completedPercent === 100 ? (
          <div className="motivation-message success">
            <h3>Поздравляем!</h3>
            <p>Вы завершили изучение всех технологий!</p>
          </div>
        ) : stats.completedPercent >= 50 ? (
          <div className="motivation-message progress">
            <h3>Отличный прогресс!</h3>
            <p>Вы уже прошли больше половины пути. Продолжайте в том же духе!</p>
          </div>
        ) : (
          <div className="motivation-message start">
            <h3>Начало пути</h3>
            <p>У вас всё обязательно получится!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;