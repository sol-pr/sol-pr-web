import { Button } from "@nextui-org/button";
import Link from "next/link";
import React from "react";

const ReturnHome = () => {
  return (
    <div className="flex flex-col gap-5 text-center">
      <p className="text-gray-400 text-xl">You are not connected :/</p>
      <Link href={"/"}>
        <Button variant="ghost">Return home</Button>
      </Link>
    </div>
  );
};

export default ReturnHome;
