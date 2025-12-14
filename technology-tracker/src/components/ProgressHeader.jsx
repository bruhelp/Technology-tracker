import './ProgressHeader.css';

function ProgressHeader({ total, completed, inProgress, notStarted }) {
    const percent = Math.round((completed / total) * 100);

    return (
        <div className="progress-header">
            <h1>Прогресс изучения</h1>

            <ul>
                <li>Изучено: <strong>{completed}</strong> из <strong>{total}</strong> ({percent}%)</li>
                <li>Изучается: <strong>{inProgress}</strong></li>
                <li>Не начато: <strong>{notStarted}</strong></li>
            </ul>
            <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}

export default ProgressHeader;