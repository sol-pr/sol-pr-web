import { CreateRepo } from "@/Schema/models/CreateRepo";
import { Button, Input } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import confetti from "canvas-confetti";
import Image from "next/image";
import { useState } from "react";
import { Snippet } from "@nextui-org/snippet";
import { motion } from "framer-motion"; // Framer Motion importu
import { GitGubServices } from "@/services/GithubServices";
import { SmartContractService } from "@/services/SmartContractService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function FlowStepForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { publicKey, connected, sendTransaction } = useWallet();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const gitGubServices = new GitGubServices();
  const smartContractService = new SmartContractService();

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

  const handleClick = async () => {
    if (connected && publicKey) {
      const user = await smartContractService.getUser(publicKey?.toBytes());
      const repo = await gitGubServices.getRepoDetails(
        user.user?.github_username || " ",
        formData.githubRepoUrl
      );

      repo.pull_request_limit = BigInt(formData.bountyCondition);
      repo.owner_wallet_address = publicKey?.toBytes() || new Uint8Array(32);
      repo.reward_per_pull_request = BigInt(
        formData.bountyPrice * LAMPORTS_PER_SOL
      );
      repo.repo_wallet_address = new Uint8Array(32);

      const response = await smartContractService.createRepository(repo);

      if (response) {
        confetti({
          particleCount: 150,
          spread: 60,
        });

        toast.success("Bounty created successfully", {
          icon: "🎉",
          style: {
            backgroundColor: "#000",
            borderBlockStyle: "solid",
            color: "#fff",
            border: "2px solid #FFFFFF40",
          },
        });

        setTimeout(() => {
          router.replace("/bounty");
        }, 2000);
      } else {
        toast.error(`someting wrong`, {
          icon: "😥",
          style: {
            backgroundColor: "#000",
            borderBlockStyle: "solid",
            color: "#fff",
            border: "2px solid #FFFFFF40",
          },
        });
      }
    }
  };

  // Framer Motion animasyon ayarları
  const variants = {
    hidden: { opacity: 0, y: -100 }, // Yukarıdan başlar
    visible: { opacity: 1, y: 0 }, // Aşağıya doğru iner
    exit: { opacity: 0, y: 100 }, // Aşağıya kaybolur
  };

  return (
    <div className="flow-step-form flex flex-col h-full mt-12">
      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={step} // Her adım için benzersiz anahtar
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5 }} // Animasyonun süresi
        >
          {step === 1 && (
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
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
            <div className="flex flex-col justify-center items-center gap-5 max-w-96">
              <Image
                src={"/repo-1.png"}
                width={400}
                height={400}
                alt=""
                className="border-3 border-gray-600 rounded-xl"
              />
              <p className="text-center">
                First, go to the settings tab of the GitHub repository where you
                want to create a bounty.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col justify-center items-center gap-5 max-w-96">
              <div className="flex">
                <Image
                  src={"/repo-2.png"}
                  width={400}
                  height={400}
                  alt=""
                  className="border-3 border-gray-600 rounded-xl"
                />
              </div>
              <p className="text-center">
                Then, select the Webhooks option from left menu bar for next
                step.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col justify-center items-center gap-5 max-w-96">
              <Image
                src={"/repo-3.png"}
                width={400}
                height={400}
                alt=""
                className="border-3 border-gray-600 rounded-xl"
              />
              <p className="text-center">
                Next, create a new webhook and paste this;
              </p>
              <Snippet>https://sol-pr-web.vercel.app/api/github</Snippet>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4 ">
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
                endContent="Sol"
              />
            </div>
          )}
        </motion.div>
      </div>

      <div className="flex justify-between items-center mt-4 relative">
        {step > 1 && (
          <Button onClick={prevStep} className="absolute top-8 left-0">
            Previous
          </Button>
        )}

        {step < 5 && (
          <Button
            onClick={nextStep}
            color="primary"
            className="absolute top-8 right-0"
          >
            Next
          </Button>
        )}
        {step === 5 && (
          <Button
            onClick={() => handleClick()}
            color="primary"
            className="absolute top-8 right-0"
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
