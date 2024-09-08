import React from "react";
import { Title } from "./Title";
import FlowStepForm from "./FlowStepForm";

const CreateRepo = () => {
  return (
    <div className="flex-col gap-10 self-start justify-center pt-32 w-fit">
      <Title
        title={"Create Bounty!"}
        description={"You can create boundy for submited pull-requests!"}
      />
      <FlowStepForm />
    </div>
  );
};

export default CreateRepo;
