"use client";
import MyTable from "@/components/MyTable";
import ReturnHome from "@/components/ReturnHome";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";

const Bounty = () => {
  const { connected } = useWallet();

  return (
    <section className="flex justify-center items-center h-screen">
      {connected ? <MyTable /> : <ReturnHome />}
    </section>
  );
};

export default Bounty;
