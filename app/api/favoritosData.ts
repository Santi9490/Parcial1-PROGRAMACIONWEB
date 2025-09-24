
import fs from 'fs';
import path from 'path';
import { Episode } from '../model/episodes';

export const FAVORITOS_PATH = path.join(process.cwd(), 'favoritos.json');

export function leerFavoritos(): Episode[] {
  if (!fs.existsSync(FAVORITOS_PATH)) return [];
  const raw = fs.readFileSync(FAVORITOS_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function escribirFavoritos(data: Episode[]): void {
  fs.writeFileSync(FAVORITOS_PATH, JSON.stringify(data, null, 2));
}
