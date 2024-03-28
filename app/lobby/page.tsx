import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Link from "next/link";
import { RxTrackPrevious } from "react-icons/rx";
import { GoMoveToEnd } from "react-icons/go";

export default function Home() {
  return (
    <main className="font-mono flex justify-around items-center min-h-screen">
      <Link className="fixed top-10 left-20" href={"/"}>
        <Button variant="outline" size="icon">
          <RxTrackPrevious className="h-4 w-4" />
        </Button>
      </Link>
      <div className="flex flex-col justify-center items-center gap-8">
        <h1 className="text-xl">Create a Lobby</h1>
        <p className="text-sm">Choose a private room number</p>
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
        <Button variant="outline">Random Generate</Button>
      </div>
      <div className="w-[1px] h-[500px] bg-slate-500"></div>
      {/* JOIN LOBBY */}
      <div className="flex flex-col justify-center items-center gap-8">
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
