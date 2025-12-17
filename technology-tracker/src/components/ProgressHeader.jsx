import './styles/ProgressHeader.css';
import ProgressBar from './ProgressBar';

function ProgressHeader({ total, completed, inProgress, notStarted }) {
  const percent = total
    ? Math.round((completed / total) * 100)
    : 0;

  return (
    <div className="progress-header">
      <h1>Прогресс изучения</h1>

      <ul>
        <li>
          Изучено: <strong>{completed}</strong> из <strong>{total}</strong> ({percent}%)
        </li>
        <li>
          Изучается: <strong>{inProgress}</strong>
        </li>
        <li>
          Не начато: <strong>{notStarted}</strong>
        </li>
      </ul>

      <ProgressBar
        progress={percent}
        color="#f18daf"
        height={18}
        animated
      />
    </div>
  );
}

export default ProgressHeader;
