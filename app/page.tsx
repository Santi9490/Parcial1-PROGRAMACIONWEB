import Image from "next/image";
import EpisodesPage from "./api/episodes/page";
import FavoritosPage from "./favoritos/page";
import CreateEpisodePage from "./create/page";

export default function Home() {
  return (
    <div className="grid grid-cols-2">
      <div>
        <EpisodesPage/>        
      </div>
      <aside>
        <div>
          <FavoritosPage/>
        </div>
        <div>
          <CreateEpisodePage/>
        </div>
      </aside>

    </div>
  );
}
