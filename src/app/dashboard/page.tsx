"use client";
import ReturnHome from "@/components/ReturnHome";
import { GitGubServices } from "@/services/GithubServices";
import { useWallet } from "@solana/wallet-adapter-react";

import React, { useState } from "react";

const Dashboard = () => {
  const { connected } = useWallet();

  return (
    <section className="flex justify-center items-center h-screen">
      {connected ? "Bounty" : <ReturnHome />}
    </section>
  );
};
export default Dashboard;
