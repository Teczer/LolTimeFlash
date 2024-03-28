import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="font-mono flex flex-col justify-center items-center gap-24 min-h-screen">
      <Link href={"/lobby"}>
        <Button variant="outline">Create or join a lobby</Button>
      </Link>
      <Link href={"/game"}>
        <Button variant="outline">Solo Lobby</Button>
      </Link>
    </main>
  );
}
