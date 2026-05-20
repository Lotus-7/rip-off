export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey() {
  return formatDateKey(new Date());
}

export function isYesterday(key) {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return key === formatDateKey(d);
}

export function getDaysAgoKeys(n) {
  const keys = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.push(formatDateKey(d));
  }
  return keys;
}

export function getWeekdayName(dateKey) {
  const names = ['日', '一', '二', '三', '四', '五', '六'];
  const d = new Date(dateKey + 'T00:00:00');
  return '周' + names[d.getDay()];
}

export function getShortDate(dateKey) {
  const [, m, d] = dateKey.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}
