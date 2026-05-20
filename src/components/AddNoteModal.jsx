import { useState } from 'react';
import { X } from 'lucide-react';
import useStore from '../hooks/useStore';
import { CATEGORIES, NOTE_COLORS } from '../lib/constants';
import { todayKey } from '../lib/dateUtils';

export default function AddNoteModal({ onClose }) {
  const addNote = useStore(s => s.addNote);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('body');
  const [color, setColor] = useState('yellow');
  const [dateKey, setDateKey] = useState(todayKey());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [subInput, setSubInput] = useState('');
  const [subTasks, setSubTasks] = useState([]);
  const [xp, setXp] = useState(30);

  const handleAddSub = () => {
    const text = subInput.trim();
    if (!text) return;
    setSubTasks(prev => [...prev, text]);
    setSubInput('');
  };

  const handleRemoveSub = (index) => {
    setSubTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSub();
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;
    addNote({
      title: title.trim(),
      description: description.trim(),
      category,
      color,
      dateKey,
      startTime,
      endTime,
      xp: Math.max(1, Number(xp) || 30),
      subTasks,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">
          新建便签
          <button
            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: 4 }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="form-group">
          <label>标题</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="今天要完成什么？"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>描述</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="补充细节（可选）"
          />
        </div>

        <div className="form-group">
          <label>分类</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>日期</label>
          <input
            type="date"
            value={dateKey}
            onChange={e => setDateKey(e.target.value)}
          />
        </div>

        <div className="form-group time-row">
          <div className="time-field">
            <label>开始时间</label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>
          <div className="time-sep">-</div>
          <div className="time-field">
            <label>结束时间</label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>颜色</label>
          <div className="color-picker">
            {NOTE_COLORS.map(c => (
              <div
                key={c.key}
                className={`color-dot${color === c.key ? ' selected' : ''}`}
                style={{ background: c.bg }}
                onClick={() => setColor(c.key)}
                title={c.key}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>子任务</label>
          <div className="sub-input-area">
            <div className="sub-input-row">
              <input
                type="text"
                value={subInput}
                onChange={e => setSubInput(e.target.value)}
                onKeyDown={handleSubKeyDown}
                placeholder="输入子任务，按回车添加"
              />
              <button type="button" onClick={handleAddSub}>添加</button>
            </div>
            {subTasks.length > 0 && (
              <div className="sub-tags">
                {subTasks.map((text, i) => (
                  <span key={i} className="sub-tag">
                    {text}
                    <button type="button" onClick={() => handleRemoveSub(i)}>x</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>XP 奖励</label>
          <input
            type="text"
            value={xp}
            onChange={e => setXp(e.target.value)}
            style={{ width: 100 }}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>取消</button>
          <button className="btn-save" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
}
