import React, { useState, useEffect } from 'react';
import './styles/TechnologyCard.css'; // Используем существующие стили или создайте новые

const DeadlineForm = ({ currentDeadline, onSave }) => {
  const [date, setDate] = useState(currentDeadline || '');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Валидация в реальном времени 
  useEffect(() => {
    validateDate(date);
  }, [date]);

  const validateDate = (value) => {
    if (!value) {
      setError('');
      setIsValid(false); // Пустая дата допустима, но не сохраняем "ничего" по кнопке, если это не очистка
      return;
    }

    const selectedDate = new Date(value);
    const today = new Date();
    // Обнуляем время для корректного сравнения дат 
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('Дедлайн не может быть в прошлом');
      setIsValid(false);
    } else {
      setError('');
      setIsValid(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid || date === '') {
      setIsSubmitting(true);
      onSave(date);
      setSuccessMsg('Срок сохранен!');
      
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg('');
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="deadline-form" noValidate>
      <div className="form-group">
        <label htmlFor="deadline-input" className="input-label">
          Установить срок изучения:
        </label>
        
        {/* Live region для скринридеров */}
        <div role="status" aria-live="polite" className="sr-only">
            {successMsg}
        </div>

        <input
          id="deadline-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          // ARIA атрибуты 
          aria-invalid={!!error}
          aria-describedby={error ? "deadline-error" : undefined}
          className={error ? 'error-input' : ''}
        />

        {/* Сообщение об ошибке */}
        {error && (
          <span id="deadline-error" className="error-message" role="alert" style={{color: 'red', display: 'block', marginTop: '5px'}}>
            {error}
          </span>
        )}
        
        {successMsg && (
             <span className="success-message" style={{color: 'green', display: 'block', marginTop: '5px'}}>
                {successMsg}
             </span>
        )}
      </div>

      <button 
        type="submit" 
        disabled={!!error || isSubmitting}
        className="btn-primary" 
        style={{marginTop: '10px'}}
      >
        Сохранить дату
      </button>
    </form>
  );
};

export default DeadlineForm;