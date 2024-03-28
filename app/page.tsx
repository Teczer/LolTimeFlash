import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="font-mono flex flex-col justify-center items-center gap-24 min-h-screen">
      <div className="flex justify-center items-center gap-4">
        <h1 className="text-2xl font-bold textstroke sm:text-3xl">
          Welcome to LolTimeFlash!
        </h1>
        <Image
          className="w-20 object-cover rounded-md rotate-6"
          width={500}
          height={500}
          src={"/flash-icon.webp"}
          alt="flash-icon"
        />
      </div>
      <Link href={"/lobby"}>
        <Button variant="outline">Create or join a lobby</Button>
      </Link>
      <Link href={"/game"}>
        <Button variant="outline">Solo Lobby</Button>
      </Link>
    </main>
  );
}
