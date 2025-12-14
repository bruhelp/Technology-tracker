import './QuickActions.css'

function QuickActions({ 
    filter, 
    onClickCompleted, 
    onClickDeleted, 
    onClickRandom, 
    onClickShowAll, 
    onClickShowNotStarted, 
    onClickShowInProgress, 
    onClickShowCompleted 
}) {
    return (
        <div className="quick-actions">
            <button title="Отметить все как выполненные" onClick={onClickCompleted}>✿</button>
            <button title="Сбросить все статусы" onClick={onClickDeleted}>✖</button>
            <button title="Случайный выбор следующей технологии" onClick={onClickRandom}>➤</button>
            
            {/* Фильтры */}
            <button 
            className={filter === 'all' ? 'active' : ''} 
            title="Все" 
            onClick={onClickShowAll}>❤
            </button>

            <button 
            className={filter === 'not-started' ? 'active' : ''} 
            title="Не начатые" 
            onClick={onClickShowNotStarted}>𒊹
            </button>

            <button 
            className={filter === 'in-progress' ? 'active' : ''} 
            title="В процессе" 
            onClick={onClickShowInProgress}>⧖
            </button>

            <button className={filter === 'completed' ? 'active' : ''} 
            title="Выполненные" 
            onClick={onClickShowCompleted}>✓
            </button>
        </div>
    );
}

export default QuickActions;