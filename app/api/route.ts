import { NextResponse } from "next/server";
import { Episode } from "../model/episodes";
import { leerEpisodios, escribirEpisodios, EPISODIOS_PATH } from "./episodiosData";
import fs from 'fs';

export async function GET() {
    try {
        let episodios: Episode[] = [];
        let debeRegenerar = false;
        if (!fs.existsSync(EPISODIOS_PATH)) {
            debeRegenerar = true;
        } else {
            episodios = leerEpisodios();
            if (!Array.isArray(episodios) || episodios.length === 0) {
                debeRegenerar = true;
            }
        }
        if (debeRegenerar) {
            const response = await fetch('https://rickandmortyapi.com/api/episode');
            const data = await response.json();
            episodios = data.results;
            escribirEpisodios(episodios);
        }
        return NextResponse.json({});
    } catch (error: any) {
        return NextResponse.json({});
    }
}

export async function POST(req: Request) {
    try {
        const nuevoEpisodio = await req.json();
        let episodios: Episode[] = leerEpisodios();
        const newId = episodios.length > 0 ? Math.max(...episodios.map(ep => ep.id)) + 1 : 1;
        const episodioCompleto: Episode = {
            ...nuevoEpisodio,
            id: newId,
            url: `https://rickandmortyapi.com/api/episode/${newId}`,
            created: new Date().toISOString()
        };
        episodios.push(episodioCompleto);
        escribirEpisodios(episodios);
        return NextResponse.json({  });
    } catch (error: any) {
        return NextResponse.json({});
    }
}