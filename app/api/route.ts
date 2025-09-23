import { NextResponse } from "next/server";
import { Episode } from "../model/episodes";


export async function GET() {
    try {
        const response = await fetch('https://rickandmortyapi.com/api/episode');
        
        if (!response.ok) {
            throw new Error('Error al obtener los episodios');
        }
        
        const data = await response.json();
        
        return NextResponse.json({
            success: true,
            data: data
        });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Error al obtener los episodios',
            error: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body) {
            return NextResponse.json({
                success: false,
                message: 'No se enviaron datos'
            }, { status: 400 });
        }
        
        console.log('Datos recibidos desde el frontend:', body);
        
        return NextResponse.json({
            success: true,
            message: 'Datos recibidos correctamente',
            receivedData: body
        });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Error al procesar los datos',
            error: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}