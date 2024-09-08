import { CreateRepo } from "@/Schema/models/CreateRepo";
import { Button, Card, CardBody, Code, Input } from "@nextui-org/react";
import confetti from "canvas-confetti";
import Image from "next/image";
import { useState } from "react";

export default function FlowStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateRepo>({
    githubRepoUrl: "",
    bountyCondition: 0,
    bountyPrice: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleClick = () => {
    console.log(formData);

    confetti({
      particleCount: 150,
      spread: 60,
    });
  };

  return (
    <div className="flow-step-form flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {step === 1 && (
          <div className="flex w-fullflex-wrap md:flex-nowrap gap-4">
            <Input
              type="text"
              label="Github Repo Url"
              name="githubRepoUrl"
              value={formData.githubRepoUrl}
              onChange={handleInputChange}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col justify-center items-center gap-5">
            <div className="flex items-center justify-center w-full gap-5">
              <Image
                src={"/repo-1.png"}
                width={300}
                height={300}
                alt=""
                className="border-3 border-gray-600 rounded-xl"
              />
              <Image
                src={"/repo-2.png"}
                width={300}
                height={300}
                alt=""
                className="border-3 border-gray-600 rounded-xl"
              />
              <Image
                src={"/repo-3.png"}
                width={300}
                height={300}
                alt=""
                className="border-3 border-gray-600 rounded-xl"
              />
            </div>
            <p className="w-3/4 text-center">
              First, go to the settings tab of the GitHub repository where you
              want to create a bounty. Then, select the Webhooks option from the
              menu. Next, create a new webhook and paste the following URL:{" "}
              <Code>https://sol-pr-web.vercel.app/api/github</Code> <br />{" "}
              That's it! You can now proceed.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input
              type="number"
              label="Bounty condition"
              name="bountyCondition"
              value={formData.bountyCondition.toString()}
              onChange={handleInputChange}
            />
            <Input
              type="number"
              label="Bounty Price"
              name="bountyPrice"
              value={formData.bountyPrice.toString()}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 fixed bottom-0 left-0 right-0 p-4">
        {step > 1 && <Button onClick={prevStep}>Previous</Button>}

        {step < 3 && (
          <Button onClick={nextStep} color="primary">
            Next
          </Button>
        )}
        {step === 3 && (
          <Button onClick={() => handleClick()} color="primary">
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}