"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { RxTrackPrevious } from "react-icons/rx";
import { GoMoveToEnd } from "react-icons/go";
import { socket } from "../socket";

export default function Home() {
  const [lobbyName, setLobbyName] = useState("");
  const router = useRouter();

  // Dans votre composant Home après la création du lobby et réception de l'URL du lobby
  const handleCreateLobby = () => {
    if (lobbyName.trim() !== "") {
      // Émettre un événement Socket.io pour créer un lobby avec le nom donné
      socket.emit("createLobby", lobbyName);

      // Réinitialiser le formulaire
      setLobbyName("");

      socket.once("lobbyCreated", (lobbyId) => {
        const lobbyURL = `/game?id=${lobbyId}`;
        // Rediriger l'utilisateur vers la page du lobby
        router.push(lobbyURL);
      });
    }
  };
  return (
    <main className="font-mono min-h-screen flex flex-col items-center justify-center gap-8 sm:flex sm:flex-row sm:justify-around sm:gap-0">
      <Link className="fixed top-6 left-6 sm:top-10 sm:left-20" href={"/"}>
        <Button variant="outline" size="icon">
          <RxTrackPrevious className="h-4 w-4" />
        </Button>
      </Link>
      {/* CREATE LOBBY */}
      <div className="flex flex-col justify-center items-center gap-4 sm:gap-8">
        <h1 className="text-xl">Create a Lobby</h1>
        <p className="text-sm">Choose a private room number</p>
        <Input
          type="text"
          placeholder="Enter lobby name"
          value={lobbyName}
          onChange={(e) => setLobbyName(e.target.value)}
        />
        <Button variant="outline" onClick={handleCreateLobby}>
          Create Lobby
        </Button>
      </div>
      {/* BORDER */}
      <div className="bg-slate-500 w-4/5 h-[1px] sm:w-[1px] sm:h-[500px]"></div>
      {/* JOIN LOBBY */}
      <div className="flex flex-col justify-center items-center gap-4 sm:gap-8">
        <h1 className="text-xl">Join a Lobby</h1>
        <p className="text-sm">Type private room number</p>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="flex justify-center items-center gap-4">
          <Input className="font-sans" type="text" placeholder="Paste Link" />
          <Button variant="outline" size="icon">
            <GoMoveToEnd className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
