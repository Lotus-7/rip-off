import useStore from '../hooks/useStore';
import { todayKey } from '../lib/dateUtils';

export default function ProgressBar() {
  const notesByDate = useStore(s => s.notesByDate);
  const today = todayKey();
  const notes = notesByDate[today] || [];

  const allSubs = notes.flatMap(n => n.subTasks || []);
  const doneSubs = allSubs.filter(s => s.done);
  const total = allSubs.length;
  const done = doneSubs.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-label">今日进度</span>
        <span className="progress-count">{done}/{total} 子任务</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="sub-progress">
        {allSubs.map(sub => (
          <div
            key={sub.id}
            className={`sub-dot${sub.done ? ' done' : ''}`}
            title={sub.text}
          />
        ))}
      </div>
    </div>
  );
}
