import { Episode } from '../model/episodes';

let favoritosMem: Episode[] = [];

export function leerFavoritos(): Episode[] {
  return favoritosMem;
}

export function escribirFavoritos(data: Episode[]): void {
  favoritosMem = data;
}
