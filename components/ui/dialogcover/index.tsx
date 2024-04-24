"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CiImageOn } from "react-icons/ci";
import Image from "next/image";
import { Input } from "../input";
import { Button } from "../button";
import { useRouter } from "next/navigation";

// Définition des types
type ChampionName = string;

const ChangeCoverButton: React.FC = () => {
  const [rawChampions, setRawChampions] = useState<ChampionName[]>([]);
  const [filteredChampions, setFilteredChampions] = useState<ChampionName[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    // Appel à la fonction fetchChampions une seule fois après le rendu initial
    fetchChampions();
  }, []); // Dépendance vide pour garantir que le useEffect ne s'exécute qu'une seule fois

  // Fonction pour récupérer les données des champions depuis l'API
  const fetchChampions = async () => {
    try {
      const response = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/14.6.1/data/en_US/champion.json"
      );
      const data = await response.json();
      // Récupérer les noms des champions
      const championNames: ChampionName[] = Object.keys(data.data);
      // Stocker les noms des champions dans l'état
      setRawChampions(championNames);
      setFilteredChampions(championNames);
    } catch (error) {
      console.error("Error fetching champion data:", error);
    }
  };

  // Fonction pour construire l'URL de l'image du splash art d'un champion
  const getChampionSplashUrl = (
    championName: ChampionName,
    skinNum: number
  ) => {
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_${skinNum}.jpg`;
  };

  // Fonction pour construire l'URL de l'image du splash art d'un champion
  const getChampionSquareUrl = (championName: ChampionName) => {
    return `https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${championName}.png`;
  };

  // Filtrer les champions en fonction de la recherche de l'utilisateur
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredChampions(rawChampions);
    } else {
      setFilteredChampions(
        rawChampions.filter((championName) =>
          championName.toLowerCase().startsWith(query.toLowerCase())
        )
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="fixed top-6 right-6 sm:top-10 sm:right-20"
          variant="outline"
          size="icon"
        >
          <CiImageOn className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={"lg:max-w-screen-lg overflow-y-scroll max-h-[65%]"}
      >
        <DialogHeader>
          <DialogTitle className="text-center">Select a new Cover</DialogTitle>
          <Input
            className="font-sans"
            type="text"
            placeholder="Find a champion"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </DialogHeader>
        <DialogDescription className="flex flex-col justify-start items-center w-full gap-3">
          {/* Affichage de la liste des champions filtrée avec leurs images de splash art */}
          {filteredChampions.map((championName: ChampionName) => (
            <div
              className="w-full h-[450px] bg-[#052431] flex flex-row justify-start items-start rounded-sm p-4"
              key={championName}
            >
              <div className="h-full flex flex-col gap-2 justifty-start items-center px-4">
                <Image
                  className="w-14 h-14 object-cover border"
                  key={championName}
                  src={getChampionSquareUrl(championName)}
                  alt={`${championName} Square`}
                  width={200}
                  height={200}
                />
                <h2 className="text-white text-md textstroke">
                  {championName}
                </h2>
              </div>
              <ul className="w-full h-full flex flex-row flex-wrap justify-center items-start gap-6">
                {/* Boucle à travers les skins d'un champion et affichage de leurs images */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((skinNum: number) => (
                  <li
                    key={skinNum}
                    onClick={() => {
                      localStorage.setItem(
                        "cover-bg",
                        `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_${skinNum}.jpg`
                      );
                      location.reload();
                    }}
                  >
                    <Image
                      unoptimized
                      quality={75}
                      className="w-[160px] object-cover rounded-sm cursor-pointer transition-all hover:scale-110"
                      src={getChampionSplashUrl(championName, skinNum)}
                      alt={`${championName} Skin ${skinNum}`}
                      width={500}
                      height={500}
                      onError={() => {}}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeCoverButton;
