import React from "react";
import { Title } from "./Title";
import FlowStepForm from "./FlowStepForm";

const CreateRepo = () => {
  return (
    <div className="flex-col self-start justify-center sm:pt-14 w-fit  mx-4 sm:mx-0">
      <Title
        title={"Create Bounty!"}
        description={"You can create boundy for submited pull-requests!"}
      />
      <FlowStepForm />
    </div>
  );
};

export default CreateRepo;
