import { useState, useEffect } from 'react';
import { Episode } from '../model/episodes';

export const useEpisodes = () => {
    const [episodes, setEpisodes] = useState<Episode[]>([]);

    useEffect(() => {
        getEpisodes();
    }, []);

    const getEpisodes = async() => {
        const response = await fetch('https://rickandmortyapi.com/api/episode');
        const data = await response.json();
        const episodes = data.results; 
        setEpisodes(episodes);
    };

    
    const agregarEpisodio = (nuevoEpisodio: Episode) => {
        setEpisodes(prevEpisodes => [...prevEpisodes, nuevoEpisodio]);
        

        const toast = document.createElement('div');
        toast.textContent = `Episodio "${nuevoEpisodio.name}" creado correctamente`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            font-size: 14px;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    };

    const eliminarEpisodio = (episodeId: number) => {
        setEpisodes(prevEpisodes => 
            prevEpisodes.filter(episode => episode.id !== episodeId)
        );
    };

    return {
        episodes,
        agregarEpisodio,
        eliminarEpisodio,
        setEpisodes
    };
};