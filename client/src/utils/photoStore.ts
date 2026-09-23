import {EXHIBITS} from '../data';
import {clearCard,loadCard,saveCard} from '../cardStore';
export const savePhoto=(id:string,data:string)=>saveCard(data,'photo-'+id);
export async function loadAllPhotos():Promise<Record<string,string>>{
  const rows=await Promise.all(EXHIBITS.map(async e=>[e.id,await loadCard('photo-'+e.id)] as const));
  return Object.fromEntries(rows.filter((r):r is readonly [string,string]=>typeof r[1]==='string'));
}
export const clearAllPhotos=clearCard;
