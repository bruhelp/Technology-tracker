import { Link } from 'react-router-dom';
import { useState } from 'react';
import RoadmapImporter from '../components/RoadmapImporter';
import TechnologySearch from '../components/TechnologySearch';
import './styles/ApiDemo.css';

function ApiDemo() {
    const [importCount, setImportCount] = useState(0);

    const handleImport = (updatedTechnologies) => {
        setImportCount(updatedTechnologies.length);
    };

    const handleSearchResults = (results) => {
        console.log('Найдено результатов:', results.length);
    };

    return (
        <div className="page api-demo-page">
            <div className="page-header">
                <Link to="/" className="back-link">← Назад на главную</Link>
                <h1>Работа с API</h1>
                <p className="page-description">
                    Демонстрация интеграции внешних API для загрузки и поиска технологий
                </p>
            </div>

            {/* Статистика */}
            <div className="api-stats">
                <div className="stat-box">
                    <span className="stat-icon">📥</span>
                    <div>
                        <p className="stat-label">Всего технологий</p>
                        <p className="stat-value">{importCount}</p>
                    </div>
                </div>
                <div className="stat-box">
                    <span className="stat-icon">🔗</span>
                    <div>
                        <p className="stat-label">Используемые API</p>
                        <p className="stat-value">3</p>
                    </div>
                </div>
            </div>

            {/* Импорт дорожных карт */}
            <RoadmapImporter onImport={handleImport} />

            {/* Поиск технологий */}
            <TechnologySearch onResultsFound={handleSearchResults} />

            {/* Информация об API */}
            <div className="api-info-section">
                <h3>Используемые API</h3>
                <div className="api-cards">
                    <div className="api-card">
                        <h4>DummyJSON API</h4>
                        <p>Используется для демонстрации поиска технологий с debounce</p>
                    </div>

                    <div className="api-card">
                        <h4>GitHub API</h4>
                        <p>Загрузка репозиториев и ресурсов для изучения технологий</p>
                    </div>

                    <div className="api-card">
                        <h4>Mock Data API</h4>
                        <p>Локальные примеры дорожных карт для быстрого импорта</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApiDemo;