import { useState, useEffect, useRef } from 'react';
import './styles/TechnologySearch.css';

function TechnologySearch({ onResultsFound }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Функция для поиска технологий в внешнем API
  const searchTechnologies = async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=6`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();

      const techResults = data.products?.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
        externalId: product.id,
        thumbnail: product.thumbnail
      })) || [];

      setResults(techResults);

      if (onResultsFound) {
        onResultsFound(techResults);
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('Ошибка при поиске:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Обработчик изменения поискового запроса с debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchTechnologies(value);
    }, 500);
  };

  const handleAddTechnology = (tech) => {
    const saved = localStorage.getItem('techTrackerData');
    const currentTechs = saved ? JSON.parse(saved) : [];

    const exists = currentTechs.some(t => 
      t.title.toLowerCase() === tech.title.toLowerCase()
    );

    if (exists) {
      alert('⚠️ Эта технология уже добавлена в трекер');
      return;
    }

    const maxId = currentTechs.length > 0 
      ? Math.max(...currentTechs.map(t => t.id)) 
      : 0;

    const newTech = {
      id: maxId + 1,
      title: tech.title,
      description: tech.description,
      status: 'not-started',
      notes: '',
      category: tech.category || 'external',
      resources: []
    };

    const updated = [...currentTechs, newTech];
    localStorage.setItem('techTrackerData', JSON.stringify(updated));
    
    alert(`✅ Технология "${tech.title}" добавлена в трекер!`);
    
    setSearchTerm('');
    setResults([]);
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="technology-search">
      <h3>🔍 Поиск технологий</h3>
      
      <div className="search-box-container">
        <input
          type="text"
          placeholder="Введите название технологии для поиска..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input-tech"
        />
        {loading && <span className="search-loading-icon">⌛</span>}
      </div>

      {error && (
        <div className="search-error">
          ❌ Ошибка поиска: {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="search-results-container">
          <p className="results-count">Найдено: {results.length}</p>
          <div className="search-results-grid">
            {results.map(tech => (
              <div key={tech.id} className="search-result-card">
                {tech.thumbnail && (
                  <img 
                    src={tech.thumbnail} 
                    alt={tech.title}
                    className="result-thumbnail"
                  />
                )}
                <div className="result-info">
                  <h4>{tech.title}</h4>
                  <p className="result-description">{tech.description}</p>
                  <span className="result-category">{tech.category}</span>
                </div>
                <button
                  onClick={() => handleAddTechnology(tech)}
                  className="add-tech-btn"
                >
                  ➕ Добавить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchTerm.trim() && !loading && results.length === 0 && !error && (
        <p className="no-results">Технологии не найдены</p>
      )}
    </div>
  );
}

export default TechnologySearch;