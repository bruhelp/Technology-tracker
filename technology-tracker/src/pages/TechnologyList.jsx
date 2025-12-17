import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styles/TechnologyList.css';
import { useNotify } from '../context/NotificationContext';

function TechnologyList() {
  const [technologies, setTechnologies] = useState([]);
  const [filter, setFilter] = useState('all');
  const { showNotify } = useNotify();

  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  const filteredTechnologies = technologies.filter(tech => {
    if (filter === 'all') return true;
    return tech.status === filter;
  });

  const getStatusLabel = (status) => {
    const labels = {
      'completed': '✓ Завершено',
      'in-progress': '⧖ В процессе',
      'not-started': '𒊹 Не начато'
    };
    return labels[status] || status;
  };

  const deleteTechnology = (id) => {
    if (window.confirm('Удалить эту технологию?')) {
      const updated = technologies.filter(t => t.id !== id);
      setTechnologies(updated);
      localStorage.setItem('techTrackerData', JSON.stringify(updated));
      showNotify("Технология удалена из общего списка", "error");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Все технологии</h1>

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Все ({technologies.length})
          </button>
          <button
            className={filter === 'not-started' ? 'active' : ''}
            onClick={() => setFilter('not-started')}
          >
            Не начато ({technologies.filter(t => t.status === 'not-started').length})
          </button>
          <button
            className={filter === 'in-progress' ? 'active' : ''}
            onClick={() => setFilter('in-progress')}
          >
            В процессе ({technologies.filter(t => t.status === 'in-progress').length})
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Завершено ({technologies.filter(t => t.status === 'completed').length})
          </button>
        </div>
      </div>

      <div className="technologies-grid">
        {filteredTechnologies.map(tech => (
          <div key={tech.id} className={`technology-item ${tech.status}`}>
            <h3>{tech.title}</h3>
            <button
              className="delete-btn"
              onClick={() => deleteTechnology(tech.id)}
              aria-label="Удалить технологию"
            >
              ×
            </button>
            <p>{tech.description}</p>

            {tech.deadline && (
              <div className="tech-deadline-badge">
                Срок: {new Date(tech.deadline).toLocaleDateString()}
              </div>
            )}

            <div className="technology-meta">
              <span className={`status status-${tech.status}`}>
                {getStatusLabel(tech.status)}
              </span>
              <Link to={`/technology/${tech.id}`} className="btn-link">
                Подробнее →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="empty-state">
          <p>Нет технологий в этой категории.</p>
        </div>
      )}
    </div>
  );
}

export default TechnologyList;