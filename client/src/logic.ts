import { EXHIBITS, type StampRecord } from './data.ts';
export const CARD_ID = 'E03';
export const QUIZ_IDS = EXHIBITS.filter(e => e.id !== CARD_ID).map(e => e.id);
export const ACHIEVEMENTS = [
  {id:'first',name:'初探珍宝',desc:'完成 1 项知识任务',symbol:'✦'},
  {id:'half',name:'半程探索者',desc:'完成 3 项知识任务',symbol:'◇'},
  {id:'scholar',name:'文物学者',desc:`完成全部 ${QUIZ_IDS.length} 项知识任务`,symbol:'卷'},
  {id:'complete',name:'馆藏通',desc:'集齐全部 6 枚印章',symbol:'藏'},
] as const;
export function normalizeRecords(value: unknown): StampRecord[] {
  if (!Array.isArray(value)) return [];
  const records = new Map<string, StampRecord>();
  for (const row of value) {
    if (row && EXHIBITS.some(e => e.id === row.exhibitId) && typeof row.time === 'string' && typeof row.answeredCorrect === 'boolean') records.set(row.exhibitId, row);
  }
  return [...records.values()];
}
export function upsertRecord(records: StampRecord[], record: StampRecord) {
  return [...records.filter(r => r.exhibitId !== record.exhibitId), record];
}
export function getAchievements(records: StampRecord[]) {
  const clean = normalizeRecords(records);
  const correct = clean.filter(r => QUIZ_IDS.includes(r.exhibitId) && r.answeredCorrect).length;
  return ACHIEVEMENTS.filter(a => a.id === 'first' ? correct >= 1 : a.id === 'half' ? correct >= 3 : a.id === 'scholar' ? correct === QUIZ_IDS.length : clean.length === EXHIBITS.length);
}
