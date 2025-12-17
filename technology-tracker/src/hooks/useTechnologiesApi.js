import { useState, useEffect } from 'react';

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка технологий из localStorage (как основной источник)
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTechnologies(parsed);
        return parsed;
      } catch (err) {
        console.error('Ошибка парсинга данных:', err);
      }
    }
    return [];
  };

  // Имитация загрузки технологий из API
  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      setError(null);

      const localData = loadFromLocalStorage();
      
      if (localData.length > 0) {
        setTechnologies(localData);
        setLoading(false);
        return;
      }

      // Имитация загрузки с задержкой
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock данные для первой загрузки
      const mockTechnologies = [
        {
          id: 1,
          title: 'React Components',
          description: 'Изучение базовых компонентов',
          status: 'completed',
          notes: '',
          category: 'frontend',
          difficulty: 'beginner',
          resources: ['https://react.dev']
        },
        {
          id: 2,
          title: 'JSX Syntax',
          description: 'Освоение синтаксиса JSX',
          status: 'in-progress',
          notes: '',
          category: 'frontend',
          difficulty: 'beginner',
          resources: ['https://react.dev/learn']
        },
        {
          id: 3,
          title: 'State Management',
          description: 'Работа с состоянием компонентов',
          status: 'not-started',
          notes: '',
          category: 'frontend',
          difficulty: 'intermediate',
          resources: ['https://react.dev/learn/managing-state']
        },
        {
          id: 4,
          title: 'React Hooks',
          description: 'useState, useEffect и другие хуки',
          status: 'in-progress',
          notes: '',
          category: 'frontend',
          difficulty: 'intermediate',
          resources: ['https://react.dev/reference/react']
        },
        {
          id: 5,
          title: 'React Router',
          description: 'Маршрутизация в приложении',
          status: 'completed',
          notes: '',
          category: 'frontend',
          difficulty: 'intermediate',
          resources: ['https://reactrouter.com']
        }
      ];

      // Сохранение в localStorage
      localStorage.setItem('techTrackerData', JSON.stringify(mockTechnologies));
      setTechnologies(mockTechnologies);
    } catch (err) {
      setError('Не удалось загрузить технологии');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  // Добавление новой технологии
  const addTechnology = async (techData) => {
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 300));

      const newTech = {
        id: Date.now(),
        status: 'not-started',
        notes: '',
        ...techData,
        createdAt: new Date().toISOString()
      };

      const updated = [...technologies, newTech];
      setTechnologies(updated);
      localStorage.setItem('techTrackerData', JSON.stringify(updated));
      
      return newTech;
    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    }
  };

  // Обновление технологии
  const updateTechnology = async (id, updates) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const updated = technologies.map(tech =>
        tech.id === id ? { ...tech, ...updates } : tech
      );

      setTechnologies(updated);
      localStorage.setItem('techTrackerData', JSON.stringify(updated));
    } catch (err) {
      throw new Error('Не удалось обновить технологию');
    }
  };

  // Загрузка технологии при монтировании
  useEffect(() => {
    fetchTechnologies();
  }, []);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    updateTechnology
  };
}

export default useTechnologiesApi;