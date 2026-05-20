import useStore from '../hooks/useStore';
import { getDaysAgoKeys, getWeekdayName, getShortDate, todayKey } from '../lib/dateUtils';
import { NOTE_COLORS } from '../lib/constants';

const COLOR_MAP = {};
NOTE_COLORS.forEach(c => { COLOR_MAP[c.key] = c.bg + '55'; });

export default function WeeklyView() {
  const notesByDate = useStore(s => s.notesByDate);

  const days = getDaysAgoKeys(7).reverse();
  const today = todayKey();

  return (
    <div className="weekly-view">
      <div className="weekly-grid">
        {days.map(dayKey => {
          const notes = notesByDate[dayKey] || [];
          const isToday = dayKey === today;

          return (
            <div key={dayKey} className={`day-column${isToday ? ' today-col' : ''}`}>
              <div className="day-header">
                <div className="day-date">{getShortDate(dayKey)}</div>
                <div className="day-weekday">{getWeekdayName(dayKey)}</div>
              </div>
              <div className="day-notes">
                {notes.length === 0 ? (
                  <div className="day-empty">无便签</div>
                ) : (
                  notes.map(note => (
                    <div
                      key={note.id}
                      className={`day-note-item ${note.completed ? 'completed' : 'pending'}`}
                      style={{ background: COLOR_MAP[note.color] || '#fde68a55' }}
                    >
                      {note.title}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
