import { NextResponse } from "next/server";
import { Episode } from "../../model/episodes";
import { leerFavoritos, escribirFavoritos, FAVORITOS_PATH } from "../favoritosData";
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
    return NextResponse.json({   });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const episode: Episode = body;
    let favoritos: Episode[] = leerFavoritos();
    favoritos.push(episode);
    escribirFavoritos(favoritos);
    return NextResponse.json({ });
  } catch (error: any) {
    return NextResponse.json({ });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get('id');
    const id = Number(episodeId);
    let favoritos: Episode[] = leerFavoritos();
    const remaining = favoritos.filter((fav: Episode) => fav.id !== id);
    escribirFavoritos(remaining);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      {}
    );
  }
}
