import React, { useState } from 'react';
import './styles/BulkStatusEditor.css'; // Не забудьте импорт стилей!

const BulkStatusEditor = ({ technologies, onUpdateStatuses }) => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('in-progress');
  const [message, setMessage] = useState('');

  const handleCheckboxChange = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleApply = () => {
    if (selectedIds.size === 0) return;
    
    onUpdateStatuses(Array.from(selectedIds), bulkStatus);
    
    setMessage(`Обновлен статус у ${selectedIds.size} элементов`);
    setSelectedIds(new Set()); 
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSelectAll = () => {
      if (selectedIds.size === technologies.length) {
          setSelectedIds(new Set());
      } else {
          const allIds = new Set(technologies.map(t => t.id));
          setSelectedIds(allIds);
      }
  }

  return (
    <div className="bulk-editor-container">
      <h3>Массовое редактирование статусов</h3>
      
      <div role="status" aria-live="polite" className="sr-only">
          {message}
      </div>
      {message && <p className="success-message" style={{color: 'var(--turquoise)', marginBottom: '10px'}}>{message}</p>}

      <div className="bulk-controls">
        <select 
            value={bulkStatus} 
            onChange={(e) => setBulkStatus(e.target.value)}
            aria-label="Выберите новый статус"
        >
          <option value="not-started">𒊹 Не начато</option>
          <option value="in-progress">⧖ В процессе</option>
          <option value="completed">✓ Завершено</option>
        </select>
        
        <button 
            onClick={handleApply} 
            disabled={selectedIds.size === 0}
            className="action-button primary"
        >
          Применить
        </button>

         <button 
            onClick={handleSelectAll} 
            className="action-button secondary"
            style={{background: 'var(--light)', color: 'var(--marengo)'}} 
        >
          {selectedIds.size === technologies.length && technologies.length > 0 ? 'Снять выделение' : 'Выбрать все'}
        </button>
      </div>

      <div className="tech-checkbox-list">
        {technologies.map(tech => (
          <div key={tech.id} className="checkbox-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedIds.has(tech.id)}
                onChange={() => handleCheckboxChange(tech.id)}
                aria-label={`Выбрать технологию ${tech.title}`}
              />
              <span className="tech-title">{tech.title}</span>
              <span className="tech-status-text">({tech.status})</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulkStatusEditor;