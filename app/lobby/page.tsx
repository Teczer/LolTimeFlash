"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { RxTrackPrevious } from "react-icons/rx";
import { socket } from "../socket";

import { GrFormNextLink } from "react-icons/gr";

export default function Home() {
  const [joinLobbyCode, setJoinLobbyCode] = useState("");
  const [lobbyCode, setLobbyCode] = useState("");
  const router = useRouter();

  function makeid(length: number) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function createLobbyCode() {
    const code = makeid(10);
    setLobbyCode(code);
  }

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
        {!lobbyCode && (
          <Button variant="outline" onClick={() => createLobbyCode()}>
            Create Lobby
          </Button>
        )}
        {lobbyCode && <p>Your code is {lobbyCode}</p>}
        {lobbyCode && (
          <Button
            onClick={() => {
              router.push(`/game/${lobbyCode}`);
            }}
            variant="outline"
            size="icon"
          >
            <GrFormNextLink className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* BORDER */}
      <div className="bg-slate-500 w-4/5 h-[1px] sm:w-[1px] sm:h-[500px]"></div>
      {/* JOIN LOBBY */}
      <div className="flex flex-col justify-center items-center gap-4 sm:gap-8">
        <h1 className="text-xl">Join a Lobby</h1>
        {/* LOBBY CODE */}
        <div className="flex justify-center items-center gap-4">
          <Input
            type="text"
            placeholder="Enter lobby code"
            value={joinLobbyCode}
            onChange={(e) => setJoinLobbyCode(e.target.value)}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              router.push(`/game/${joinLobbyCode}`);
            }}
          >
            <GrFormNextLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
