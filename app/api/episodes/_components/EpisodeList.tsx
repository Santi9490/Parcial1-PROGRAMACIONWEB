'use client';

import { Episode, Character } from "@/app/model/episodes";
import { useEffect, useState } from "react";

export const EpisodesGrid = () => {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [characters, setCharacters] = useState<{[key: string]: Character}>({});

    useEffect(() => {
        getEpisodes();
    }, [])

    const getEpisodes = async() => {
        const response = await fetch('https://rickandmortyapi.com/api/episode');
        const data = await response.json();
        const episodes = data.results; 
        setEpisodes(episodes);
    }

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
            const fetchCharacter = async () => {
                setLoading(true);
                const char = await getCharacter(url);
                setCharacter(char);
                setLoading(false);
            };

            fetchCharacter();
        }, [url]);

        if (loading) return <div className="text-sm text-gray-500">Cargando...</div>;
        if (!character) return <div className="text-sm text-red-500">Error al cargar personaje</div>;

        return (
            <div className="flex items-center gap-2 p-2 border rounded">
                <img 
                    src={character.image} 
                    alt={character.name}
                    className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{character.name}</span>
            </div>
        );
    };

    return (
        <div className="p-4">
            <div className="space-y-4">
                {episodes.map(episode => (
                    <div key={episode.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-bold text-lg">{episode.name}</h3>
                                <p className="text-gray-600">{episode.episode}</p>
                                <p className="text-gray-500">{episode.air_date}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Personajes:</h4>
                                <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
                                    {episode.characters.slice(0, 5).map((characterUrl, index) => (
                                        <CharacterItem key={characterUrl} url={characterUrl} />
                                    ))}
                                    {episode.characters.length > 5 && (
                                        <div className="text-sm text-gray-500 p-2">
                                            +{episode.characters.length - 5} personajes más...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}