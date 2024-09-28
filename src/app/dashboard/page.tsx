"use client";
import CreateBadge from "@/components/dashboard/CreateBadge";
import CreateBounty from "@/components/dashboard/CreateBounty";
import LastNotification from "@/components/dashboard/LastNotification";
import PopularBounties from "@/components/dashboard/PopularBounties";
import { PrChart } from "@/components/dashboard/PrChart";
import TotalEarn from "@/components/dashboard/TotalEarn";
import ReturnHome from "@/components/ReturnHome";
import { Title } from "@/components/Title";
import { SmartContractService } from "@/services/SmartContractService";
import { Card } from "@nextui-org/card";
import { useWallet } from "@solana/wallet-adapter-react";

import React, { useEffect, useState } from "react";

const componentsList = [
  <TotalEarn />,
  <CreateBounty />,
  <PrChart />,
  <PopularBounties />,
  <LastNotification />,
  <CreateBadge />,
];

const Dashboard = () => {
  const { connected, publicKey } = useWallet();
  const [userName, setUserName] = useState("");
  const smartContractService = new SmartContractService();

  useEffect(() => {
    async function fetchData() {
      if (connected && publicKey) {
        const response = await smartContractService.getUser(
          publicKey.toBytes()
        );
        if (response.isSuccessful) {
          setUserName(response.user?.github_username || "");
        }
      }
    }
    fetchData();
  }, [connected == true]);
  return (
    <section className="flex justify-center items-center min-h-screen">
      {connected ? (
        <div className="w-3/4">
          <Title title="Welcome!" description={userName} />
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
