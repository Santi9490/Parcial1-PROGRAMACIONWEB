'use client';
import { EpisodesGrid } from './_components/EpisodeList';
import { useEffect, useState } from 'react';
import { Episode } from '@/app/model/episodes';

export default function EpisodesPage () {
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
            <EpisodesGrid favoritos={favoritos} actualizarFavoritos={actualizarFavoritos} />
        </div>
    );
};