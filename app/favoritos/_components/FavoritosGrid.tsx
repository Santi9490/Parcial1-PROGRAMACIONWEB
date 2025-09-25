'use client';

import { Character, Episode } from "@/app/model/episodes";
import { useState, useEffect } from "react";


export const FavoritosGrid = () => {
    const [characters, setCharacters] = useState<{[key: string]: Character}>({});
    const [favoritos, setFavoritos] = useState<Episode[]>([]);

    useEffect(() => {
    actualizarFavoritos();
    }, []);

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

    const eliminarFavorito = async (episodeId: number) => {
        try {
            const response = await fetch(`/api/favoritos?id=${episodeId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await actualizarFavoritos();
            } else {
                console.error('Error al eliminar favorito');
            }
        } catch (error) {
            console.error('Error al eliminar favorito:', error);
        }
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
            console.error(error);
            return null;
        }
    }

    const CharacterItem = ({ url }: { url: string }) => {
        const [character, setCharacter] = useState<Character | null>(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchCharacter = async () => {
                setLoading(true);
                const char = await getCharacter(url);
                setCharacter(char);
                setLoading(false);
            };

            fetchCharacter();
        }, [url]);

        if (loading) return (
            <div >
                <div ></div>
                <div >Cargando...</div>
            </div>
        );
        
        if (!character) return (
            <div >
                <div >
                    <span>Error</span>
                </div>
            </div>
        );

        return (
            <div className="flex flex-col items-center">
                <img 
                    src={character.image} 
                    alt={character.name}
                    
                />
                <span >{character.name}</span>
            </div>
        );
    };

    return (
        <div >
            <h1 >Episodios Favoritos</h1>
            
            {favoritos.length === 0 ? (
                <div >
                    <p >No tienes episodios favoritos</p>
                    <p >Ve a la lista de episodios y marca algunos como favoritos</p>
                </div>
            ) : (
                <div >
                    {favoritos.map(episode => (
                        <div key={episode.id}>
                            
                            <div className="mb-3">
                                <h3 >{episode.name}</h3>
                                <p >{episode.episode}</p>
                            </div>
            
                            <div>
                                
                                <div>
                                    <span >Fecha de emisión:</span>
                                    <p >{episode.air_date}</p>
                                </div>
                                
                                
                                <button 
                                    onClick={() => eliminarFavorito(episode.id)}
                                    
                                >
                                    Quitar de favoritos
                                </button>
                            </div>
                            <div className="mt-4">
                                <div >
                                    {episode.characters.slice(0, 5).map((characterUrl: string, index: number) => (
                                        <CharacterItem key={`${episode.id}-${characterUrl}`} url={characterUrl} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
           
        </div>
    );
}
