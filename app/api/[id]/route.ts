import { NextResponse, NextRequest } from "next/server";
import type { Episode } from "../../model/episodes";
import { leerEpisodios, escribirEpisodios } from "../episodiosData";



export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const episodeId = Number(id);
    let episodios: Episode[] = leerEpisodios();
    const restantes = episodios.filter(ep => ep.id !== episodeId);
    escribirEpisodios(restantes);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al eliminar el episodio',
        error: error?.message || 'Error desconocido'
      }, 
      { status: 500 }
    );
  }
}
