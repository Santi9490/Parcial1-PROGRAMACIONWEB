import { Episode } from '../model/episodes';

let episodiosMem: Episode[] = [];

export function leerEpisodios(): Episode[] {
  return episodiosMem;
}

export function escribirEpisodios(data: Episode[]): void {
  episodiosMem = data;
}
