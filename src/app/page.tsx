"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import Icon3D from "@/components/Icon3D";

export default function Home() {
  return (
    <main className="md:flex flex-col items-center justify-center h-screen overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-col sm:flex-row items-center sm:justify-between justify-end sm:w-4/5">
        <div className="flex flex-col gap-5 mt-20 sm:mt-0 p-10 sm:p-0">
          <h1 className="md:text-9xl text-7xl font-bold">
            WELCOME <br />
            TO
          </h1>
          <h3 className="md:text-7xl text-3xl font-mono font-bold text-primary-500">
            sol-pr
          </h3>
          <p className="w-1/2">
            Web app that create your own bounty program for submited
            pull-request your github repository!
          </p>
        </div>
        <Icon3D />
      </div>
    </main>
  );
}
