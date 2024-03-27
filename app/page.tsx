"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LeagueRoles {
  name: string;
  src: string;
}

const leagueRoles: LeagueRoles[] = [
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
  const [gameTimer, setGameTimer] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isSummonerIsTimed, setIsSummonerIsTimed] = useState({
    TOP: false,
    JUNGLE: false,
    MID: false,
    SUPPORT: false,
    ADC: false,
  });
  const [cooldownTimers, setCooldownTimers] = useState<{
    [key: string]: string;
  }>({});

  function startGame() {
    setGameTimer(new Date().getTime());
  }

  function startFlashCooldown(role: string) {
    const startTime = new Date().getTime();
    const endTime = startTime + 5 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));

      if (timeLeft === 0) {
        clearInterval(interval);
        setIsSummonerIsTimed((prevState) => ({ ...prevState, [role]: false }));
        setCooldownTimers((prevTimers) => ({ ...prevTimers, [role]: "" }));
        return;
      }

      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;
      setCooldownTimers((prevTimers) => ({
        ...prevTimers,
        [role]: formattedTime,
      }));
    }, 1000);

    setIsSummonerIsTimed((prevState) => ({ ...prevState, [role]: true }));
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameTimer !== null) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const timeElapsed = Math.floor((now - gameTimer) / 1000);
        setElapsedTime(timeElapsed);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameTimer]);

  return (
    <main className="flex flex-col justify-center items-center gap-24 min-h-screen">
      <div className="w-full flex justify-around items-center">
        {leagueRoles.map((role, index) => (
          <div
            className="flex flex-col justify-center items-center gap-4"
            key={index}
          >
            <button
              className="transition-all hover:scale-110"
              onClick={() => startFlashCooldown(role.name)}
            >
              <Image
                className={cn("w-40 h-40", {
                  "filter brightness-50": isSummonerIsTimed[role.name] === true,
                })}
                width={600}
                height={600}
                src={role.src}
                alt={role.name}
              />
            </button>
            {isSummonerIsTimed[role.name] && (
              <p className="absolute text-2xl font-bold">
                {cooldownTimers[role.name]}
              </p>
            )}
          </div>
        ))}
      </div>
      {gameTimer ? (
        <div>
          <p className="text-lg font-bold">{`${Math.floor(elapsedTime / 60)}:${(
            elapsedTime % 60
          )
            .toString()
            .padStart(2, "0")}`}</p>
        </div>
      ) : (
        <Button variant="outline" className="w-1/6" onClick={startGame}>
          Start Game
        </Button>
      )}
    </main>
  );
}
