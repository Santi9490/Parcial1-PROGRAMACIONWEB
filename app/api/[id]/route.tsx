import { NextResponse } from "next/server";
import { Episode } from "../../model/episodes";


let episodes: Episode[] = [];


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (episodes.length === 0) {
      const response = await fetch('https://rickandmortyapi.com/api/episode');
      const data = await response.json();
      episodes = data.results;
    }
    
    const episode = episodes.find(ep => ep.id === Number(id));
    
    if (!episode) {
      return NextResponse.json(
        { success: false, message: 'Episodio no encontrado' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: episode
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al obtener el episodio',
        error: error instanceof Error ? error.message : 'Error desconocido'
      }, 
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const episodeId = Number(id);
    
    if (isNaN(episodeId)) {
      return NextResponse.json(
        { success: false, message: 'ID de episodio inválido' },
        { status: 400 }
      );
    }
    
    if (episodes.length === 0) {
      const response = await fetch('https://rickandmortyapi.com/api/episode');
      const data = await response.json();
      episodes = data.results;
    }
    
    const episodeIndex = episodes.findIndex(ep => ep.id === episodeId);
    
    if (episodeIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Episodio no encontrado' },
        { status: 404 }
      );
    }
    
    // Guardar los datos del episodio eliminado para la respuesta
    const deletedEpisode = episodes[episodeIndex];
    
    // Eliminar el episodio del array
    episodes.splice(episodeIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Episodio eliminado correctamente',
      deletedEpisode: {
        id: deletedEpisode.id,
        name: deletedEpisode.name,
        episode: deletedEpisode.episode
      },
      remainingCount: episodes.length
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al eliminar el episodio',
        error: error instanceof Error ? error.message : 'Error desconocido'
      }, 
      { status: 500 }
    );
  }
}