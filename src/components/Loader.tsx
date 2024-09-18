"use client"; // Client-side bileşen olduğunu belirtir

import { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/spinner";
import { motion } from "framer-motion";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }} // Başlangıç durumu
      animate={{ opacity: 1, y: 0 }} // Animasyon son durumu
      transition={{ duration: 0.5 }} // Geçiş süresi (0.5 saniye)
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

export default Loader;
