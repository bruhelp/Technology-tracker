import { useState } from 'react';
import Modal from './Modal';
import './styles/QuickActions.css';

function QuickActions({
  technologies,

  filter,
  onMarkAllCompleted,
  onResetAll,
  onRandomTech,

  onShowAll,
  onShowNotStarted,
  onShowInProgress,
  onShowCompleted,
}) {
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies,
    };

    console.log(
      'Данные для экспорта:',
      JSON.stringify(data, null, 2)
    );

    setShowExportModal(true);
  };

  return (
    <div className="quick-actions">
      {/* Основные действия */}
      <button title="Отметить все как выполненные" onClick={onMarkAllCompleted}>✿</button>
      <button title="Сбросить все статусы" onClick={onResetAll}>✖</button>
      <button title="Случайный выбор следующей технологии" onClick={onRandomTech}>➤</button>
      <button title="Экспорт данных" onClick={handleExport}>⤴</button>

      {/* Фильтры */}
      <button
        className={filter === 'all' ? 'active' : ''}
        title="Все"
        onClick={onShowAll}
      >❤
      </button>

      <button
        className={filter === 'not-started' ? 'active' : ''}
        title="Не начатые"
        onClick={onShowNotStarted}
      >𒊹
      </button>

      <button
        className={filter === 'in-progress' ? 'active' : ''}
        title="В процессе"
        onClick={onShowInProgress}
      >⧖
      </button>

      <button
        className={filter === 'completed' ? 'active' : ''}
        title="Выполненные"
        onClick={onShowCompleted}
      >✓
      </button>

      {/* Модалка экспорта */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
      >
        <p>Данные успешно подготовлены для экспорта!</p>
        <p>Проверьте консоль разработчика.</p>
      </Modal>
    </div>
  );
}

export default QuickActions;
