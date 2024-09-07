"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Icon3D from "@/components/Icon3D";

export default function Home() {
  const { publicKey } = useWallet();

  useEffect(() => {
    if (publicKey) {
      // publicKey değerini cookie olarak sakla
      Cookies.set("auth-token", publicKey.toString(), { expires: 7 });
    } else {
      // Eğer publicKey yoksa cookie'yi sil
      Cookies.remove("auth-token");
    }
  }, [publicKey]);

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between w-4/5">
        <div className="flex flex-col gap-5">
          <h1 className="md:text-9xl font-bold">
            WELCOME <br />
            TO
          </h1>
          <h3 className="text-5xl font-mono text-primary-500">sol-pr</h3>
        </div>
        <Icon3D />
      </div>
    </main>
  );
}
