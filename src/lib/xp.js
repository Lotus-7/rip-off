const LEVELS = [
  { level: 1,  title: '便签新手',  xpRequired: 0 },
  { level: 2,  title: '初学者',    xpRequired: 100 },
  { level: 3,  title: '小有所成',  xpRequired: 300 },
  { level: 4,  title: '习惯养成',  xpRequired: 600 },
  { level: 5,  title: '自律达人',  xpRequired: 1000 },
  { level: 6,  title: '便签高手',  xpRequired: 1500 },
  { level: 7,  title: '行家里手',  xpRequired: 2200 },
  { level: 8,  title: '大师之路',  xpRequired: 3000 },
  { level: 9,  title: '生活匠人',  xpRequired: 4000 },
  { level: 10, title: '标签传说',  xpRequired: 5500 },
];

export function getLevel(totalXP) {
  let current = LEVELS[0];
  let next = LEVELS[1] || null;

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }

  const xpInLevel = totalXP - current.xpRequired;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 1;
  const progress = next ? xpInLevel / xpNeeded : 1;

  return { ...current, next, xpInLevel, xpNeeded, progress };
}
