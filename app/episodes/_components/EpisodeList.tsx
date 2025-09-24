'use client';

import { Episode, Character } from "@/app/model/episodes";
import { useEffect, useState } from "react";

interface EpisodesGridProps {
    favoritos: Episode[];
    actualizarFavoritos: () => Promise<void>;
}

export const EpisodesGrid = () => {
    const [characters, setCharacters] = useState<{[key: string]: Character}>({});
    const [episodes, setEpisodes] = useState<Episode[]>([]);


    const [favoritos, setFavoritos] = useState<Episode[]>([]);

    

    useEffect(() => {
        getEpisodes();
        actualizarFavoritos();
    }, []);


    const getEpisodes = async() => {
        try {
            const response = await fetch('/api');
            const result = await response.json();
            
            if (result.success) {
                setEpisodes(result.data.results);
            } else {
                console.error('Error al obtener episodios:', result.message);
            }
        } catch (error) {
            console.error('Error al obtener episodios:', error);
        }
    };

    const esFavorito = (episodeId: number): boolean => {
        return favoritosIds.includes(episodeId);
    };

    

    const getCharacter = async(url: string) => {
        try {
            if (characters[url]) {
                return characters[url];
            }

            const response = await fetch(url);
            const character = await response.json();
            
            setCharacters(prev => ({
                ...prev,
                [url]: character
            }));
            
            return character;
        } catch (error) {
            console.error('Error fetching character:', error);
            return null;
        }
    }


    
    const CharacterItem = ({ url }: { url: string }) => {
        const [character, setCharacter] = useState<Character | null>(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            fetchCharacter();
        }, [url]);

        const fetchCharacter = async () => {
                setLoading(true);
                const char = await getCharacter(url);
                setCharacter(char);
                setLoading(false);
            };

        if (loading) return (
            <div >
                <div>Cargando...</div>
            </div>
        );
        
        if (!character) return (
            <div>
                <div>
                    <span>Error</span>
                </div>
            </div>
        );

        return (
            <div className="flex flex-col items-center">
                <img 
                    src={character.image} 
                    alt={character.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-300"
                />
                <span className="text-xs text-center mt-1 max-w-20 truncate">{character.name}</span>
            </div>
        );
    };


    const eliminarEpisodio = async (episodeId: number) => {
        const res = await fetch(`/api/${episodeId}`, { method: 'DELETE' });
        if (res.ok) {
            await getEpisodes();
        }
    };


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

    const favoritosIds = favoritos.map(ep => ep.id);


    const toggleFavorito = async (episode: Episode) => {
        try {
            if (esFavorito(episode.id)) {
                const response = await fetch(`/api/favoritos?id=${episode.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    await actualizarFavoritos();
                }
            } else {
                const response = await fetch('/api/favoritos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(episode)
                });
                if (response.ok) {
                    await actualizarFavoritos();
                }
            }
        } catch (error) {
            console.error('Error al actualizar favorito:', error);
        }
    };

    return (
        <div>
            <div className="space-y-4">
                {episodes.map(episode => (
                    <div key={episode.id} >
                        
                        <div >
                            <h3 >{episode.name}</h3>
                            <p>{episode.episode}</p>
                        </div>
        
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span>Fecha de emisión:</span>
                                <p>{episode.air_date}</p>
                            </div>
                            
                            
                        </div>

                        <div className="mt-4">
                            
                            <div>
                                {episode.characters.slice(0, 5).map((characterUrl) => (
                                    <CharacterItem key={`${episode.id}-${characterUrl}`} url={characterUrl} />
                                ))}
                            </div>
                            
                        </div>

                        <div className="flex gap-2">
                                <button 
                                    onClick={() => toggleFavorito(episode)}
                                    className={`px-3 py-1 rounded border ${esFavorito(episode.id) }`}
                                >
                                    {esFavorito(episode.id) ? '★ Favorito' : '☆ Agregar'}
                                </button>
                                
                                <button 
                                    onClick={() => eliminarEpisodio(episode.id)}
                                    className="bg-red-500"
                                >
                                    Eliminar
                                </button>
                            </div>
                    </div>
                ))}
            </div>
            
            {episodes.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Cargando episodios...</p>
                </div>
            )}
        </div>
    );
}