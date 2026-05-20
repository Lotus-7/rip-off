import useStore from '../hooks/useStore';
import { getLevel } from '../lib/xp';
import { getDaysAgoKeys } from '../lib/dateUtils';
import { CATEGORIES } from '../lib/constants';

export default function StatsPanel() {
  const profile = useStore(s => s.profile);
  const streak = useStore(s => s.streak);
  const notesByDate = useStore(s => s.notesByDate);

  const levelInfo = getLevel(profile.totalXP);

  // Gather all notes across all dates
  const allNotes = Object.values(notesByDate).flat();
  const totalCompleted = allNotes.filter(n => n.completed).length;
  const totalNotes = allNotes.length;
  const completionRate = totalNotes > 0 ? Math.round((totalCompleted / totalNotes) * 100) : 0;

  // Category breakdown
  const catCounts = {};
  for (const [key] of Object.entries(CATEGORIES)) {
    catCounts[key] = allNotes.filter(n => n.category === key).length;
  }
  const maxCatCount = Math.max(...Object.values(catCounts), 1);

  // XP trend: last 7 days
  const days = getDaysAgoKeys(7).reverse();
  const dailyXP = days.map(dk => {
    const notes = notesByDate[dk] || [];
    return notes
      .filter(n => n.completed)
      .reduce((sum, n) => sum + (n.xp || 0), 0);
  });
  const maxDailyXP = Math.max(...dailyXP, 1);

  return (
    <div className="stats-panel">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">总 XP</div>
          <div className="stat-card-value">{profile.totalXP}</div>
          <div className="stat-card-sub">Lv.{levelInfo.level} {levelInfo.title}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">完成率</div>
          <div className="stat-card-value">{completionRate}%</div>
          <div className="stat-card-sub">{totalCompleted}/{totalNotes} 便签</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">当前连续</div>
          <div className="stat-card-value">{streak.current} 天</div>
          <div className="stat-card-sub">最长 {streak.longest} 天</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">等级进度</div>
          <div className="stat-card-value">{Math.round(levelInfo.progress * 100)}%</div>
          <div className="stat-card-sub">
            {levelInfo.next
              ? `距 Lv.${levelInfo.next.level} 还需 ${levelInfo.xpNeeded - levelInfo.xpInLevel} XP`
              : '已满级'}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="stats-section">
        <div className="stats-section-title">分类统计</div>
        <div className="category-breakdown">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <div key={key} className="cat-row">
              <span className="cat-label">{cat.label}</span>
              <div className="cat-bar-bg">
                <div
                  className="cat-bar-fill"
                  style={{
                    width: `${(catCounts[key] / maxCatCount) * 100}%`,
                    background: cat.color,
                  }}
                />
              </div>
              <span className="cat-count">{catCounts[key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* XP trend */}
      <div className="stats-section">
        <div className="stats-section-title">近 7 日 XP</div>
        <div className="stat-bar-chart">
          {dailyXP.map((xp, i) => (
            <div key={i} className="stat-bar-col">
              <div className="stat-bar-value">{xp || ''}</div>
              <div
                className="stat-bar"
                style={{ height: `${Math.max((xp / maxDailyXP) * 100, 4)}%` }}
              />
              <div className="stat-bar-label">
                {days[i].slice(5).replace('-', '/')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
