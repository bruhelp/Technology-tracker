import './TechnologyCard.css';

function TechnologyCard({ title, description, status, className, onSwitch }) {
    
    const statusClass = {
        'completed': 'technology-card completed',
        'in-progress': 'technology-card in-progress',
        'not-started': 'technology-card not-started'
    }[status];

    const statusLabel = {
        'completed': 'Завершено',
        'in-progress': 'В процессе',
        'not-started': 'Не начато'
    }[status];

    return (
        <div className={statusClass}>
            <h3>{title}</h3>
            <p>{description}</p>

            <div className="status">
                {statusLabel}
                <button title="Смена статуса" onClick={onSwitch}>↓</button>
            </div>
        </div>
    );
}

export default TechnologyCard;
