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
        return NextResponse.json({
            success: true,
            data: {
                results: episodios
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Error al obtener los episodios',
            error: error?.message || 'Error desconocido'
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const nuevoEpisodio = await req.json();
        if (!nuevoEpisodio || !nuevoEpisodio.name || !nuevoEpisodio.characters) {
            return NextResponse.json({
                success: false,
                message: 'Datos incompletos del episodio'
            }, { status: 400 });
        }
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
        return NextResponse.json({
            success: true,
            message: 'Episodio creado correctamente',
            data: episodioCompleto
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Error al crear el episodio',
            error: error?.message || 'Error desconocido'
        }, { status: 500 });
    }
}