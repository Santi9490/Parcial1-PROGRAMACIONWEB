'use client';

import { useEffect, useState } from 'react';
import { FavoritosGrid } from "./_components/FavoritosGrid";
import { Episode } from '@/app/model/episodes';

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<Episode[]>([]);

  const actualizarFavoritos = async () => {
    try {
      const response = await fetch('/api/favoritos');
      const result = await response.json();
      if (result.success) {
        setFavoritos(result.data);
      }
    } catch (error) {
      setFavoritos([]);
    }
  };

  useEffect(() => {
    actualizarFavoritos();
  }, []);

  return (
    <div>
      <h1>Favoritos</h1>
      <FavoritosGrid favoritos={favoritos} actualizarFavoritos={actualizarFavoritos} />
    </div>
  );
}