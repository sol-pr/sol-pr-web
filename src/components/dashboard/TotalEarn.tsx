import { Button } from "@nextui-org/button";
import { CardBody } from "@nextui-org/card";
import { CircleDollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const TotalEarn = () => {
  const router = useRouter();
  return (
    <CardBody className="flex flex-col justify-center relative items-center h-full gap-3">
      <CircleDollarSign
        className="opacity-15 absolute z-10 left-[-80px] top-[-50px]"
        size={240}
      />
      <h2 className="font-semibold z-20">Total Earn</h2>
      <p className="text-5xl font-bold text-primary-500 z-20">0.00 SOL</p>
      <Button
        color="default"
        className="z-20"
        onClick={() => router.push("/my-account")}
      >
        View Detail
      </Button>
    </CardBody>
  );
};

export default TotalEarn;
