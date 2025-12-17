import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ResourceLoader from '../components/ResourceLoader';
import DeadlineForm from '../components/DeadlineForm'; 
import './styles/TechnologyDetail.css';
import '../components/styles/DeadlineForm.css'; 

import { useNotify } from '../context/NotificationContext';

function TechnologyDetail() {
  const { showNotify } = useNotify();
  const { techId } = useParams();
  const [technology, setTechnology] = useState(null);
  const [notes, setNotes] = useState('');
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      const technologies = JSON.parse(saved);
      const tech = technologies.find(t => t.id === parseInt(techId));
      setTechnology(tech);
      setNotes(tech?.notes || '');
      setResources(tech?.resources || []);
    }
  }, [techId]);

  const updateStatus = (newStatus) => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
      );
      localStorage.setItem('techTrackerData', JSON.stringify(updated));
      setTechnology({ ...technology, status: newStatus });
      showNotify("Статус изменен", "info");
    }
  };

  const saveNotes = () => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) ? { ...tech, notes: notes } : tech
      );
      localStorage.setItem('techTrackerData', JSON.stringify(updated));
      showNotify("Заметки успешно сохранены", "success");
    }
  };

  const updateDeadline = (newDeadline) => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) ? { ...tech, deadline: newDeadline } : tech
      );
      localStorage.setItem('techTrackerData', JSON.stringify(updated));
      setTechnology({ ...technology, deadline: newDeadline });
      showNotify("Срок изучения обновлен", "success");
    }
  };

  const handleResourcesLoaded = (loadedResources) => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech => {
        if (tech.id === parseInt(techId)) {
          const existingResources = tech.resources || [];
          return { 
            ...tech, 
            resources: [...existingResources, ...loadedResources]
          };
        }
        return tech;
      });
      localStorage.setItem('techTrackerData', JSON.stringify(updated));
      setResources(prev => [...prev, ...loadedResources]);
    }
  };

  if (!technology) {
    return (
      <div className="page">
        <h1>Технология не найдена</h1>
        <p>Технология с ID {techId} не существует.</p>
        <Link to="/technologies" className="btn">
          ← Назад к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="page technology-detail-page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">
          ← Назад к списку
        </Link>
        <h1>{technology.title}</h1>
      </div>

      <div className="technology-detail-grid">
        <div className="detail-section">
          <h3>Описание</h3>
          <p>{technology.description}</p>
        </div>

        <div className="detail-section">
          <h3>Статус изучения</h3>
          <div className="status-buttons">
            <button
              onClick={() => updateStatus('not-started')}
              className={technology.status === 'not-started' ? 'active not-started' : 'not-started'}
            >
              𒊹 Не начато
            </button>
            <button
              onClick={() => updateStatus('in-progress')}
              className={technology.status === 'in-progress' ? 'active in-progress' : 'in-progress'}
            >
              ⧖ В процессе
            </button>
            <button
              onClick={() => updateStatus('completed')}
              className={technology.status === 'completed' ? 'active completed' : 'completed'}
            >
              ✓ Завершено
            </button>
          </div>
        </div>

        <div className="detail-section">
           <DeadlineForm 
              currentDeadline={technology.deadline} 
              onSave={updateDeadline} 
           />
        </div>

        <div className="detail-section">
          <h3>Мои заметки</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Добавьте заметки о процессе изучения..."
            rows="6"
            className="notes-textarea"
          />
          <button onClick={saveNotes} className="save-notes-btn">
            Сохранить заметки
          </button>
        </div>

        <div className="detail-section">
          <ResourceLoader 
            technologyTitle={technology.title}
            onResourcesLoaded={handleResourcesLoaded}
          />
        </div>
      </div>
    </div>
  );
}

export default TechnologyDetail;