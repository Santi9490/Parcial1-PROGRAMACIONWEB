import fs from 'fs';
import path from 'path';
import { Episode } from '../model/episodes';

export const EPISODIOS_PATH = path.join(process.cwd(), 'episodios.json');

export function leerEpisodios(): Episode[] {
  if (!fs.existsSync(EPISODIOS_PATH)) return [];
  const raw = fs.readFileSync(EPISODIOS_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function escribirEpisodios(data: Episode[]): void {
  fs.writeFileSync(EPISODIOS_PATH, JSON.stringify(data, null, 2));
}
