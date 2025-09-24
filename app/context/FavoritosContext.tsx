import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Episode } from "@/app/model/episodes";

interface FavoritosContextType {
  favoritos: Episode[];
  actualizarFavoritos: () => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) throw new Error("useFavoritos debe usarse dentro de FavoritosProvider");
  return context;
};

export const FavoritosProvider = ({ children }: { children: ReactNode }) => {
  const [favoritos, setFavoritos] = useState<Episode[]>([]);

  const actualizarFavoritos = async () => {
    try {
      const response = await fetch('/api/favoritos');
      const result = await response.json();
      if (result.success) {
        setFavoritos(result.data);
      }
    } catch (error) {
      setFavoritos([]);
    }
  };

  useEffect(() => {
    actualizarFavoritos();
  }, []);

  return (
    <FavoritosContext.Provider value={{ favoritos, actualizarFavoritos }}>
      {children}
    </FavoritosContext.Provider>
  );
};
