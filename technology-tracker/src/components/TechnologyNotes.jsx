import './styles/TechnologyNotes.css';

function TechnologyNotes({ notes, onNotesChange, techId }) {
    return (
        <div className="notes-section">
            <textarea
                value={notes}
                onChange={(e) => onNotesChange(techId, e.target.value)}
                placeholder="Записывайте ваши мысли..."
                rows="3"
            />
            <div className="notes-hint">
                {notes.length > 0 ? `Заметка сохранена (${notes.length} символов)` : 'Добавьте заметку при необходимости'}
            </div>
        </div>
    );
}

export default TechnologyNotes;
