import { NextResponse } from "next/server";
import type { Episode } from "../../model/episodes";
import { leerEpisodios, escribirEpisodios } from "../episodiosData";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const episodios: Episode[] = leerEpisodios();
    const episodio = episodios.find(ep => ep.id === Number(id));
    return NextResponse.json({
      success: true,
      data: episodio
    });
  } catch (error: any) {
    return NextResponse.json({});
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const episodeId = Number(id);
    let episodios: Episode[] = leerEpisodios();
    const restantes = episodios.filter(ep => ep.id !== episodeId);
    escribirEpisodios(restantes);
    return NextResponse.json({ });
  } catch (error: any) {
    return NextResponse.json({});
  }
}
