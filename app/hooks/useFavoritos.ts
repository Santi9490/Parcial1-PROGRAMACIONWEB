import { useState, useEffect } from 'react';
import { Episode } from '../model/episodes';

export const useFavoritos = () => {
    const [favoritos, setFavoritos] = useState<Episode[]>([]);
    useEffect(() => {
        const favoritosGuardados = localStorage.getItem('favoritos');
        if (favoritosGuardados) {
            try {
                const favoritos = JSON.parse(favoritosGuardados);
                setFavoritos(favoritos);
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    
    const guardarEnLocalStorage = (nuevosFavoritos: Episode[]) => {
        localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
    };

    
    
    const esFavorito = (episodeId: number): boolean => {
        return favoritos.some(fav => fav.id === episodeId);
    };
    const agregarFavorito = (episode: Episode) => {
        if (!esFavorito(episode.id)) {
            const nuevosFavoritos = [...favoritos, episode];
            setFavoritos(nuevosFavoritos);
            guardarEnLocalStorage(nuevosFavoritos);
        }
    };
    const eliminarFavorito = (episodeId: number) => {
        const episodeEliminado = favoritos.find(fav => fav.id === episodeId);
        const nuevosFavoritos = favoritos.filter(fav => fav.id !== episodeId);
        setFavoritos(nuevosFavoritos);
        guardarEnLocalStorage(nuevosFavoritos);
    };
    const toggleFavorito = (episode: Episode) => {
        if (esFavorito(episode.id)) {
            eliminarFavorito(episode.id);
        } else {
            agregarFavorito(episode);
        }
    };

    return {
        favoritos,
        esFavorito,
        agregarFavorito,
        eliminarFavorito,
        toggleFavorito
    };
};