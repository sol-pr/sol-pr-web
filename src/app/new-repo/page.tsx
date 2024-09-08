"use client";
import CreateRepo from "@/components/CreateRepo";
import ReturnHome from "@/components/ReturnHome";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";

const newRepo = () => {
  const { connected } = useWallet();

  return (
    <section className="flex justify-center items-center w-screen h-screen">
      {connected ? <CreateRepo /> : <ReturnHome />}
    </section>
  );
};

export default newRepo;
