import { useState, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';
import { useNotify } from '../context/NotificationContext';

const initialTechnologies = [
  { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed', notes: '' },
  { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress', notes: '' },
  { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started', notes: '' },
];

function useTechnologies() {
  const { showNotify } = useNotify();
  const [technologies, setTechnologies] = useLocalStorage(
    'techTrackerData',
    initialTechnologies
  );

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const nextStatus = (current) => ({
    'not-started': 'in-progress',
    'in-progress': 'completed',
    'completed': 'not-started',
  }[current]);

  const updateStatus = (id) => {
    setTechnologies(prev =>
      prev.map(t => {
        if (t.id === id) {
          const next = nextStatus(t.status);
          showNotify(`Статус обновлен на: ${next}`, "success"); // Добавляем уведомление
          return { ...t, status: next };
        }
        return t;
      })
    );
  };

  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(t =>
        t.id === techId ? { ...t, notes: newNotes } : t
      )
    );
  };

  const allCompleted = () => {
    setTechnologies(prev =>
      prev.map(t => ({ ...t, status: 'completed' }))
    );
  };

  const allDeleted = () => {
    setTechnologies(prev =>
      prev.map(t => ({ ...t, status: 'not-started' }))
    );
  };

  const randomTech = () => {
    const notStarted = technologies.filter(t => t.status === 'not-started');
    if (!notStarted.length) {
      alert('Невозможно выбрать новую технологию');
      return;
    }

    const random = notStarted[Math.floor(Math.random() * notStarted.length)];

    setTechnologies(prev =>
      prev.map(t =>
        t.id === random.id ? { ...t, status: 'in-progress' } : t
      )
    );
  };

  const stats = useMemo(() => {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    const inProgress = technologies.filter(t => t.status === 'in-progress').length;
    const notStarted = technologies.filter(t => t.status === 'not-started').length;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      progress: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [technologies]);

  const visibleTechnologies = useMemo(() => {
    return technologies
      .filter(t => filter === 'all' || t.status === filter)
      .filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [technologies, filter, searchQuery]);

  const deleteTechnology = (id) => {
    if (window.confirm('Вы уверены?')) {
      const updated = technologies.filter(tech => tech.id !== id);
      setTechnologies(updated);
      showNotify("Технология удалена", "warning"); // Добавляем уведомление
    }
  };


  return {
    technologies,
    visibleTechnologies,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    updateStatus,
    updateNotes,
    deleteTechnology,
    total: stats.total,
    completed: stats.completed,
    inProgress: stats.inProgress,
    notStarted: stats.notStarted,
    progress: stats.progress,
    allCompleted: () => setTechnologies(prev => prev.map(t => ({ ...t, status: 'completed' }))),
    allDeleted: () => {
        if(window.confirm("Очистить всё?")) setTechnologies([]);
    },
    randomTech: () => {
        const randomIndex = Math.floor(Math.random() * technologies.length);
        alert("Рекомендуем изучить: " + technologies[randomIndex]?.title);
    }
  };
}

export default useTechnologies;