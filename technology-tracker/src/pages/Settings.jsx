import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BulkStatusEditor from '../components/BulkStatusEditor'; // Импорт задания 2
import './styles/Settings.css';
import { useNotify } from '../context/NotificationContext';

function Settings({ onLogout }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const { showNotify } = useNotify();

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Пользователь';
    setUsername(user);

    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  const handleBulkUpdate = (ids, newStatus) => {
    const updatedTechs = technologies.map(tech =>
      ids.includes(tech.id) ? { ...tech, status: newStatus } : tech
    );
    setTechnologies(updatedTechs);
    localStorage.setItem('techTrackerData', JSON.stringify(updatedTechs));
    showNotify(`Обновлено элементов: ${ids.length}`, "success");
  };

  const handleResetProgress = () => {
    const resetTech = technologies.map(t => ({
      ...t,
      status: 'not-started',
      notes: '',
      deadline: '' 
    }));
    localStorage.setItem('techTrackerData', JSON.stringify(resetTech));
    setTechnologies(resetTech);
    setShowConfirmReset(false);
    showNotify("Весь прогресс был сброшен", "info");
  };

  const handleClearAllData = () => {
    localStorage.removeItem('techTrackerData');
    setTechnologies([]);
    setShowConfirmClear(false);
    showNotify("Все данные успешно стерты", "error");
  };

  const handleExportData = () => {
    const dataToExport = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      technologies: technologies,
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`; // Дата в имени файла
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        let techsArray = [];
        if (Array.isArray(importedData)) {
          techsArray = importedData;
        } else if (importedData.technologies && Array.isArray(importedData.technologies)) {
          techsArray = importedData.technologies;
        } else {
          throw new Error("Некорректная структура файла. Ожидался массив или объект с полем 'technologies'.");
        }

        const isValid = techsArray.every(item =>
          item.hasOwnProperty('id') &&
          item.hasOwnProperty('title') &&
          item.hasOwnProperty('status')
        );

        if (!isValid) {
          throw new Error("Ошибка формата данных: у технологий отсутствуют обязательные поля (id, title, status).");
        }

        localStorage.setItem('techTrackerData', JSON.stringify(techsArray));
        setTechnologies(techsArray);
        alert(`Данные успешно импортированы! Загружено ${techsArray.length} записей.`);

      } catch (error) {
        alert(`Ошибка импорта: ${error.message}`);
        console.error(error);
      }
    };
    event.target.value = '';
    reader.readAsText(file);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="page settings-page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">← Назад к списку</Link>
        <h1>Настройки</h1>
      </div>

      <div className="settings-section">
        <h2>Профиль</h2>
        <div className="user-profile">
          <img className="user-avatar" src={`${import.meta.env.BASE_URL}Miku_screen.jpg`} alt="Аватар"></img>
          <div className="user-details">
            <p><strong>Имя:</strong> {username}</p>
            <p><strong>Всего технологий:</strong> {technologies.length}</p>
            <button onClick={handleLogout} className="logout-button">
              Выйти из системы
            </button>
          </div>
        </div>
      </div>

      {/* Внедрение компонента ЗАДАНИЯ 2 */}
      <div className="settings-section">
        <BulkStatusEditor technologies={technologies} onUpdateStatuses={handleBulkUpdate} />
      </div>

      <div className="settings-section">
        <h2>Управление данными</h2>

        <div className="settings-actions">
          <div className="action-item">
            <div className="action-info">
              <h3>Экспорт данных</h3>
              <p>Сохранить структуру и прогресс</p>
            </div>
            <button onClick={handleExportData} className="action-button primary">
              Экспортировать JSON
            </button>
          </div>

          <div className="action-item">
            <div className="action-info">
              <h3>Импорт данных</h3>
              <p>Загрузить JSON (с валидацией)</p>
            </div>
            <label className="action-button primary" htmlFor="import-file">
              Импортировать JSON
            </label>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </div>

          <div className="action-item">
            <div className="action-info">
              <h3>Сброс прогресса</h3>
              <p>Вернуть все статусы в "не начато"</p>
            </div>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="action-button warning"
            >
              Сбросить
            </button>
          </div>

          <div className="action-item">
            <div className="action-info">
              <h3>Очистка</h3>
              <p>Удалить все данные</p>
            </div>
            <button
              onClick={() => setShowConfirmClear(true)}
              className="action-button danger"
            >
              Удалить всё
            </button>
          </div>
        </div>
      </div>

      {/* Модальные окна (без изменений) */}
      {showConfirmReset && (
        <div className="modal-overlay" onClick={() => setShowConfirmReset(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Подтверждение сброса</h3>
            <p>Вы уверены? Статусы, заметки и сроки будут удалены.</p>
            <div className="modal-actions">
              <button onClick={handleResetProgress} className="confirm-button">Да, сбросить</button>
              <button onClick={() => setShowConfirmReset(false)} className="cancel-button">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {showConfirmClear && (
        <div className="modal-overlay" onClick={() => setShowConfirmClear(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Подтверждение удаления</h3>
            <p>Вы уверены? Данные будут потеряны навсегда.</p>
            <div className="modal-actions">
              <button onClick={handleClearAllData} className="confirm-button danger">Да, удалить всё</button>
              <button onClick={() => setShowConfirmClear(false)} className="cancel-button">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;