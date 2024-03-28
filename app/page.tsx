"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { IoIosCopy } from "react-icons/io";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface LeagueRoles {
  name: string;
  src: string;
}

const leagueRoles: LeagueRoles[] = [
  {
    name: "TOP",
    src: "/toprole-icon.png",
  },
  {
    name: "JUNGLE",
    src: "/junglerole-icon.png",
  },
  {
    name: "MID",
    src: "/midrole-icon.png",
  },
  {
    name: "ADC",
    src: "/adcrole-icon.png",
  },
  {
    name: "SUPPORT",
    src: "/supportrole-icon.png",
  },
];

export default function Home() {
  const { toast } = useToast();

  const [gameTimer, setGameTimer] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isSummonerIsTimed, setIsSummonerIsTimed] = useState<{
    [key: string]: boolean;
  }>({
    TOP: false,
    JUNGLE: false,
    MID: false,
    SUPPORT: false,
    ADC: false,
  });
  const [cooldownTimers, setCooldownTimers] = useState<{
    [key: string]: string;
  }>({});
  const [copyPasteTimer, setCopyPasteTimer] = useState<string | null>(null);

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

    // Calcul de l'heure de fin du cooldown
    const endCooldownTime = new Date(gameTimer + 5 * 60 * 1000);
    const endCooldownHour = endCooldownTime.getHours();
    const endCooldownMinutes = endCooldownTime.getMinutes();
    const formattedEndCooldownTime = `${role}${endCooldownHour}:${String(
      endCooldownMinutes
    ).padStart(2, "0")}`;

    setCopyPasteTimer(formattedEndCooldownTime);
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
    <main className="font-mono flex flex-col justify-center items-center gap-24 min-h-screen">
      <div className="w-full flex flex-wrap items-center justify-center sm:flex sm:justify-around sm:items-center">
        {leagueRoles.map((role, index) => (
          <div
            className="flex flex-col justify-center items-center gap-4"
            key={index}
          >
            <button
              className="transition-all hover:scale-110"
              onClick={() => {
                if (gameTimer === 0) {
                  toast({
                    variant: "destructive",
                    title: "You have to start game before !",
                    description:
                      "How you would time your flash if you don't start the game ?",
                    action: (
                      <ToastAction onClick={startGame} altText="Try again">
                        Start Game
                      </ToastAction>
                    ),
                  });
                  return;
                }
                startFlashCooldown(role.name);
              }}
            >
              <Image
                className={cn("w-28 object-cover sm:w-48", {
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
        <Button variant="outline" className="" onClick={startGame}>
          Start Game
        </Button>
      )}
      <div className="flex justify-center items-center gap-4">
        <Input
          className="font-sans"
          type="text"
          placeholder="Flash Timer"
          value={copyPasteTimer || ""}
          readOnly
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (copyPasteTimer) {
              navigator.clipboard.writeText(copyPasteTimer);
              toast({
                title: "Your text has been copied to your clipboard!",
              });
            }
          }}
        >
          <IoIosCopy className="h-4 w-4" />
        </Button>
      </div>
    </main>
  );
}
