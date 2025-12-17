import { useState } from 'react';
import './styles/ResourceLoader.css';

function ResourceLoader({ technologyTitle, onResourcesLoaded }) {
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);

  // Загрузка ресурсов из GitHub API
  const loadResourcesFromGitHub = async () => {
    try {
      setLoading(true);
      setError(null);

      // Поиск репозиториев на GitHub по названию технологии
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(technologyTitle)}&sort=stars&order=desc&per_page=5`
      );

      if (!response.ok) {
        throw new Error('Не удалось загрузить ресурсы');
      }

      const data = await response.json();

      // Преобразуем результаты в ресурсы
      const loadedResources = data.items?.map(repo => ({
        id: repo.id,
        title: repo.name,
        url: repo.html_url,
        description: repo.description || 'Нет описания',
        stars: repo.stargazers_count,
        language: repo.language,
        type: 'github'
      })) || [];

      setResources(loadedResources);

      // Передаем ресурсы родительскому компоненту
      if (onResourcesLoaded) {
        onResourcesLoaded(loadedResources);
      }

    } catch (err) {
      setError(err.message);
      console.error('Ошибка загрузки ресурсов:', err);
    } finally {
      setLoading(false);
    }
  };

  // Добавление популярных ресурсов вручную
  const addPopularResources = () => {
    const popularResources = [
      {
        id: 'mdn-' + Date.now(),
        title: 'MDN Web Docs',
        url: `https://developer.mozilla.org/ru/search?q=${encodeURIComponent(technologyTitle)}`,
        description: 'Документация от Mozilla',
        type: 'documentation'
      },
      {
        id: 'stackoverflow-' + Date.now(),
        title: 'Stack Overflow',
        url: `https://stackoverflow.com/search?q=${encodeURIComponent(technologyTitle)}`,
        description: 'Вопросы и ответы',
        type: 'community'
      },
      {
        id: 'youtube-' + Date.now(),
        title: 'YouTube',
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(technologyTitle + ' tutorial')}`,
        description: 'Видео-уроки',
        type: 'video'
      }
    ];

    setResources(prev => [...prev, ...popularResources]);

    if (onResourcesLoaded) {
      onResourcesLoaded(popularResources);
    }
  };

  return (
    <div className="resource-loader">
      <div className="loader-header">
        <h4>📚 Загрузка ресурсов</h4>
        <div className="loader-actions">
          <button
            onClick={loadResourcesFromGitHub}
            disabled={loading}
            className="load-btn primary"
          >
            {loading ? '⌛ Загрузка...' : '🔗 GitHub репозитории'}
          </button>
          <button
            onClick={addPopularResources}
            className="load-btn secondary"
          >
            ⭐ Популярные ресурсы
          </button>
        </div>
      </div>

      {error && (
        <div className="loader-error">
          ❌ {error}
        </div>
      )}

      {resources.length > 0 && (
        <div className="resources-list">
          <p className="resources-count">Найдено ресурсов: {resources.length}</p>
          {resources.map(resource => (
            <div key={resource.id} className="resource-item">
              <div className="resource-icon">
                {resource.type === 'github' && '💻'}
                {resource.type === 'documentation' && '📖'}
                {resource.type === 'community' && '💬'}
                {resource.type === 'video' && '🎥'}
              </div>
              <div className="resource-details">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  {resource.title}
                </a>
                <p className="resource-description">{resource.description}</p>
                {resource.stars && (
                  <span className="resource-stars">⭐ {resource.stars.toLocaleString()}</span>
                )}
                {resource.language && (
                  <span className="resource-language">{resource.language}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResourceLoader;