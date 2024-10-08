"use client";
import ReturnHome from "@/components/ReturnHome";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";

const MyAccount = () => {
  const { connected } = useWallet();

  return (
    <section className="flex justify-center items-center h-screen">
      {connected ? "Bounty" : <ReturnHome />}
    </section>
  );
};

export default MyAccount;
