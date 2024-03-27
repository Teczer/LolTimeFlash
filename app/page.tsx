"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const leagueRoles = [
  {
    name: "TOP",
    src: "https://ih1.redbubble.net/image.2355783081.2767/st,small,507x507-pad,600x600,f8f8f8.jpg",
  },
  {
    name: "JUNGLE",
    src: "https://ih1.redbubble.net/image.2354146454.1555/st,small,507x507-pad,600x600,f8f8f8.jpg",
  },
  {
    name: "MID",
    src: "https://ih1.redbubble.net/image.2354236031.4306/st,small,507x507-pad,600x600,f8f8f8.jpg",
  },
  {
    name: "ADC",
    src: "https://ih1.redbubble.net/image.2354182272.2636/st,small,507x507-pad,600x600,f8f8f8.jpg",
  },
  {
    name: "SUPPORT",
    src: "https://ih1.redbubble.net/image.2354270772.5334/st,small,507x507-pad,600x600,f8f8f8.jpg",
  },
];

export default function Home() {
  const [gameStartTime, setGameStartTime] = useState(null);
  const [timers, setTimers] = useState({});

  const handleStart = () => {
    setGameStartTime(new Date());
  };

  const handleClick = (role) => {
    if (!gameStartTime) {
      alert("Veuillez d'abord démarrer la partie");
      return;
    }

    const now = new Date();
    const timeElapsedInSeconds = (now - gameStartTime) / 1000;
    const cooldownEndTime = new Date(
      now.getTime() + (5 * 60 - timeElapsedInSeconds) * 1000
    );

    const formattedMinutes = cooldownEndTime
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const formattedSeconds = cooldownEndTime
      .getSeconds()
      .toString()
      .padStart(2, "0");

    const countdownText = `${role.toUpperCase()}${formattedMinutes}:${formattedSeconds}`;

    setTimers({ ...timers, [role]: countdownText });

    // Copier dans le presse-papiers
    navigator.clipboard
      .writeText(countdownText)
      .then(() =>
        console.log("Texte copié dans le presse-papiers :", countdownText)
      )
      .catch((err) =>
        console.error("Erreur lors de la copie dans le presse-papiers :", err)
      );
  };

  return (
    <main className="flex flex-col justify-around items-center min-h-screen">
      <div className="w-full flex justify-around items-center">
        {leagueRoles.map((role, index) => (
          <div key={index}>
            <button
              className="transition-all hover:scale-110"
              onClick={() => handleClick(role.name)}
            >
              <Image
                className="w-20 h-20"
                width={200}
                height={200}
                src={role.src}
                alt={role.name}
              />
            </button>
            {timers[role.name] && <p>{timers[role.name]}</p>}
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-1/6" onClick={handleStart}>
        Start
      </Button>
    </main>
  );
}
