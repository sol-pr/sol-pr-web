import { Button } from "@nextui-org/button";
import { BadgePlus, GitBranchPlus } from "lucide-react";
import React from "react";

const CreateBounty = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-3 relative">
      <BadgePlus
        className="opacity-15 absolute z-10 right-[-80px]  top-[-50px]"
        size={240}
      />
      <h1 className="text-primary-500 font-bold text-center text-3xl lg:text-5xl z-10">
        Create Bounty!
      </h1>
      <p className="max-w-48 text-center leading-5 text-foreground-400 z-10">
        You can create bounty for your repos right now
      </p>
      <Button color="primary" variant="shadow" className="font-bold z-10">
        Create!
      </Button>
    </div>
  );
};

export default CreateBounty;
