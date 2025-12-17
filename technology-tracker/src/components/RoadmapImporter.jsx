import { useState } from 'react';
import './styles/RoadmapImporter.css';

function RoadmapImporter({ onImport }) {
  const [importing, setImporting] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  // Пример дорожных карт
  const exampleRoadmaps = [
    {
      name: 'Frontend Developer',
      url: 'frontend',
      technologies: [
        { title: 'HTML & CSS', description: 'Основы веб-разработки', difficulty: 'beginner' },
        { title: 'JavaScript ES6+', description: 'Современный JavaScript', difficulty: 'beginner' },
        { title: 'React.js', description: 'Библиотека для UI', difficulty: 'intermediate' },
        { title: 'TypeScript', description: 'Типизированный JavaScript', difficulty: 'intermediate' },
        { title: 'Next.js', description: 'React фреймворк', difficulty: 'advanced' }
      ]
    },
    {
      name: 'Backend Developer',
      url: 'backend',
      technologies: [
        { title: 'Node.js', description: 'JavaScript на сервере', difficulty: 'beginner' },
        { title: 'Express.js', description: 'Веб-фреймворк для Node.js', difficulty: 'beginner' },
        { title: 'MongoDB', description: 'NoSQL база данных', difficulty: 'intermediate' },
        { title: 'REST API', description: 'Проектирование API', difficulty: 'intermediate' },
        { title: 'Docker', description: 'Контейнеризация', difficulty: 'advanced' }
      ]
    },
    {
      name: 'Full Stack',
      url: 'fullstack',
      technologies: [
        { title: 'Git & GitHub', description: 'Система контроля версий', difficulty: 'beginner' },
        { title: 'SQL', description: 'Язык запросов к БД', difficulty: 'intermediate' },
        { title: 'GraphQL', description: 'Язык запросов для API', difficulty: 'advanced' },
        { title: 'CI/CD', description: 'Непрерывная интеграция', difficulty: 'advanced' },
        { title: 'AWS/Azure', description: 'Облачные платформы', difficulty: 'advanced' }
      ]
    }
  ];

  // Имитация загрузки дорожной карты
  const handleImportRoadmap = async (roadmapData) => {
    try {
      setImporting(true);

      // Имитация загрузки с задержкой
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Получаем текущие технологии
      const saved = localStorage.getItem('techTrackerData');
      const currentTechs = saved ? JSON.parse(saved) : [];

      // Находим максимальный ID
      const maxId = currentTechs.length > 0 
        ? Math.max(...currentTechs.map(t => t.id)) 
        : 0;

      // Добавляем новые технологии
      const newTechs = roadmapData.technologies.map((tech, index) => ({
        id: maxId + index + 1,
        title: tech.title,
        description: tech.description,
        status: 'not-started',
        notes: '',
        category: 'imported',
        difficulty: tech.difficulty || 'beginner',
        resources: []
      }));

      const updated = [...currentTechs, ...newTechs];
      localStorage.setItem('techTrackerData', JSON.stringify(updated));

      // Вызываем callback для обновления UI
      if (onImport) {
        onImport(updated);
      }

      alert(`✅ Успешно импортировано ${newTechs.length} технологий из "${roadmapData.name}"`);
      
    } catch (err) {
      alert(`❌ Ошибка импорта: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  // Импорт из JSON файла
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        
        if (imported.technologies && Array.isArray(imported.technologies)) {
          await handleImportRoadmap({
            name: imported.name || 'Импортированная дорожная карта',
            technologies: imported.technologies
          });
        } else {
          alert('❌ Неверный формат файла!');
        }
      } catch (error) {
        alert('❌ Ошибка при чтении файла!');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="roadmap-importer">
      <h3>Импорт дорожной карты</h3>
      
      {/* Быстрый импорт примеров */}
      <div className="import-examples">
        <p>Выберите готовую дорожную карту:</p>
        <div className="example-buttons">
          {exampleRoadmaps.map((roadmap) => (
            <button
              key={roadmap.url}
              onClick={() => handleImportRoadmap(roadmap)}
              disabled={importing}
              className="example-btn"
            >
              {importing ? '⌛ Импорт...' : `${roadmap.name} (${roadmap.technologies.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Разделитель */}
      <div className="divider">
        <span>или</span>
      </div>

      {/* Импорт из файла */}
      <div className="import-file">
        <p>Импортируйте из JSON файла:</p>
        <label className="file-input-label">
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            disabled={importing}
            style={{ display: 'none' }}
          />
          <span className="file-btn">
            📄 Выбрать файл
          </span>
        </label>
      </div>

      {/* Информация */}
      <div className="import-info">
        <small>
          💡 Импортированные технологии будут добавлены к существующим
        </small>
      </div>
    </div>
  );
}

export default RoadmapImporter;