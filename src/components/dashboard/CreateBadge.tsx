import { Button } from "@nextui-org/button";
import { PencilRuler } from "lucide-react";
import React from "react";

const CreateBadge = () => {
  return (
    <div className="flex flex-col relative justify-center items-center h-full gap-3">
      <PencilRuler
        className="opacity-15 absolute z-10 right-[-80px]  top-[-50px]"
        size={240}
      />
      <p className="text-foreground-400">If you dont have,</p>
      <h1 className="text-primary-500 text-4xl font-bold">Create Your Badge</h1>
      <p>for your repository..</p>
      <Button variant="flat" color="primary">
        Create!
      </Button>
    </div>
  );
};

export default CreateBadge;
