"use client"; // Client-side bileşen olduğunu belirtir

import { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/spinner";
function Loader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1 saniye sonra loader'ı kaldır
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  if (loading) {
    return (
      <div className="dark text-foreground bg-background purple-dark h-screen flex flex-col items-center justify-center gap-5">
        <Spinner color="primary" />
        <p className="text-xl text-foreground-400">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default Loader;
