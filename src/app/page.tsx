"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import Icon3D from "@/components/Icon3D";

export default function Home() {
  const { connected } = useWallet();

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between w-4/5">
        <div className="flex flex-col gap-5">
          <h1 className="md:text-9xl font-bold">
            WELCOME <br />
            TO
          </h1>
          <h3 className="text-7xl font-mono font-bold text-primary-500">
            sol-pr
          </h3>
        </div>
        <Icon3D />
      </div>
    </main>
  );
}
