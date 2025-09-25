import { NextResponse } from "next/server";
import { Episode } from "../../model/episodes";
import { leerFavoritos, escribirFavoritos } from "../favoritosData";
import fs from 'fs';

export async function GET() {
  try {
    let favoritos: Episode[] = [];
    
    favoritos = leerFavoritos();
    return NextResponse.json({
      success: true,
      data: favoritos
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al obtener favoritos',
        error: error?.message || 'Error desconocido'
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const episode: Episode = body;
    let favoritos: Episode[] = leerFavoritos();
    favoritos.push(episode);
    escribirFavoritos(favoritos);
    return NextResponse.json({
      success: true,
      message: 'Episodio agregado a favoritos',
      data: episode
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al agregar favorito',
        error: error?.message || 'Error desconocido'
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get('id');
    if (!episodeId) {
      return NextResponse.json({
        success: false,
        message: 'ID de episodio requerido'
      }, { status: 400 });
    }
    const id = Number(episodeId);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de episodio inválido'
      }, { status: 400 });
    }
    let favoritos: Episode[] = leerFavoritos();
    const remaining = favoritos.filter((fav: Episode) => fav.id !== id);
    escribirFavoritos(remaining);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al eliminar favorito',
        error: error?.message || 'Error desconocido'
      }, 
      { status: 500 }
    );
  }
}
