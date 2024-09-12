"use client";
import TotalEarn from "@/components/dashboard/TotalEarn";
import ReturnHome from "@/components/ReturnHome";
import { Title } from "@/components/Title";
import { GitGubServices } from "@/services/GithubServices";
import { Card } from "@nextui-org/card";
import { useWallet } from "@solana/wallet-adapter-react";

import React, { useState } from "react";

const componentsList = [
  <TotalEarn />, // 1. bileşen
  <div>Component 2</div>, // 2. bileşen
  <div>Component 3</div>, // 3. bileşen
  <div>Component 4 (Geniş)</div>, // 4. bileşen - geniş olacak
  <div>Component 5</div>, // 5. bileşen
  <div>Component 6</div>, // 6. bileşen
];

const Dashboard = () => {
  const { connected } = useWallet();

  return (
    <section className="flex justify-center items-center min-h-screen">
      {connected ? (
        <div className="w-3/4">
          <Title title="Welcome!" description="Bgraokmsuh" />
          <div className="grid auto-rows-[220px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            {componentsList.map((Component, i) => (
              <Card
                key={i}
                className={`row-span-1 border-2 border-slate-400/10 ${
                  i === 3 || i === 6 ? "md:col-span-2" : "" // 4. ve 7. kutular geniş olacak
                } ${i === 3 ? "md:row-span-2" : ""} `}
              >
                {Component}
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <ReturnHome />
      )}
    </section>
  );
};
export default Dashboard;
