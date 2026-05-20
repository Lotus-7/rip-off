import { HeartPulse, Brain, Wrench, Handshake, Coins, Leaf, LayoutGrid } from 'lucide-react';
import useStore from '../hooks/useStore';
import { CATEGORIES } from '../lib/constants';

const ICON_MAP = {
  HeartPulse,
  Brain,
  Wrench,
  Handshake,
  Coins,
  Leaf,
};

export default function CategoryTabs() {
  const activeFilter = useStore(s => s.activeFilter);
  const setActiveFilter = useStore(s => s.setActiveFilter);

  const tabs = [
    { key: 'all', label: '全部', icon: LayoutGrid },
    ...Object.entries(CATEGORIES).map(([key, cat]) => ({
      key,
      label: cat.label,
      icon: ICON_MAP[cat.icon],
    })),
  ];

  return (
    <div className="tabs">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            className={`tab${activeFilter === tab.key ? ' active' : ''}`}
            onClick={() => setActiveFilter(tab.key)}
          >
            <Icon />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
