import './styles/TechnologyCard.css';

// Принимаем объект technology и функцию onDelete
function TechnologyCard({ technology, onStatusUpdate, onDelete }) {
    const { title, description, status, deadline } = technology;

    const statusClass = {
        'completed': 'technology-card completed',
        'in-progress': 'technology-card in-progress',
        'not-started': 'technology-card not-started'
    }[status] || 'technology-card';

    const statusLabel = {
        'completed': 'Завершено',
        'in-progress': 'В процессе',
        'not-started': 'Не начато'
    }[status];

    return (
        <div className={statusClass}>
            <div className="tech-card-header">
                <h3>{title}</h3>
            </div>

            <p>{description}</p>

            {deadline && (
                <div>
                    <p>Дедлайн: {new Date(deadline).toLocaleDateString()}</p>
                </div>
            )}

            <div className="status">
                {statusLabel}
                <button title="Смена статуса" onClick={() => onStatusUpdate(technology.id)}>↓</button>
            </div>

            <button
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                title="Удалить технологию"
            >×
            </button>
        </div>
    );
}

export default TechnologyCard;