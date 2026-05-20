import { Tag, Flame, Plus } from 'lucide-react';
import useStore from '../hooks/useStore';

export default function TopBar({ onAdd }) {
  const streak = useStore(s => s.streak);

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="logo-icon">
          <Tag />
        </div>
        <span className="logo-text">标签俱乐部</span>
      </div>
      <div className="top-bar-right">
        <div className="streak-badge">
          <Flame />
          <span>{streak.current} 天</span>
        </div>
        <button className="add-btn" onClick={onAdd} title="添加便签">
          <Plus />
        </button>
      </div>
    </div>
  );
}
