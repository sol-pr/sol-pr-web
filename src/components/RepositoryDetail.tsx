import { RepositoryModel } from "@/Schema/models/RepositoryModel";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Title } from "./Title";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { publicDecrypt } from "crypto";
import { SmartContractService } from "@/services/SmartContractService";

interface Props {
  repo: RepositoryModel;
}

const RepositoryDetail = ({ repo }: Props) => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [repoBalance, setRepoBalance] = useState<number>();
  const smartContractService = new SmartContractService();
  useEffect(() => {
    const getRepoBalance = async () => {
      const balance = await smartContractService.getRepoBalace(repo.id);
      await setRepoBalance(balance);
    };
    getRepoBalance();
  }, []);

  return (
    <div className="md:w-3/4">
      {repo === undefined ? (
        "Data not found :/"
      ) : (
        <>
          <Title title="View Detail" description={`id -> ${repo.id}`} />
          <div className="flex flex-col sm:flex sm:flex-row justify-between items-start gap-4 mt-4">
            <div className="flex flex-col md:w-1/4 gap-4">
              <Card className="border-2 border-slate-400/10">
                <CardBody className="gap-2 p-5 min-h-[470px] ">
                  <Image
                    src={"/logo.png"}
                    width={150}
                    height={150}
                    alt="logo"
                    className="self-center bg-black rounded-full border-2 border-primary-500"
                  />
                  <span className="font-mono">Name: </span>
                  <h1 className="text-3xl font-bold"> {repo.repo_name}</h1>
                  <p className="text-foreground-400">
                    {repo.repo_description}...
                  </p>
                </CardBody>
              </Card>
              <Card className="border-2 border-slate-400/10">
                <CardBody className="p-10">
                  <p className="font-mono">
                    created by:{" "}
                    <span className="text-primary-500 hover:text-primary-300">
                      {repo.owner_wallet_address}
                    </span>{" "}
                  </p>
                </CardBody>
              </Card>
            </div>

            <div className="md:w-3/4">
              <div className="flex flex-col md:flex md:flex-row wrap gap-4 ">
                {" "}
                <Card className="md:w-1/4 bg-transparent mt-4 md:mt-0 border-2 border-slate-400/10">
                  <CardBody className="flex items-center justify-center p-10 gap-4">
                    <h2 className="text-foreground-400 text-xl">
                      Total PR Count
                    </h2>
                    <h1 className="font-mono text-5xl">
                      {repo.total_pull_requests}
                    </h1>
                  </CardBody>
                </Card>
                <Card className="md:w-1/4 bg-transparent mt-4 md:mt-0 border-2 border-slate-400/10">
                  <CardBody className="flex items-center justify-center p-10 gap-4">
                    <h2 className="text-foreground-400 text-xl">PR/Reward</h2>
                    <h1 className="font-mono text-5xl">
                      {repo.pull_request_limit}
                    </h1>
                  </CardBody>
                </Card>
                <Card className="md:w-1/4 bg-transparent mt-4 md:mt-0 border-2 border-slate-400/10">
                  <CardBody className="flex items-center justify-center p-10 gap-4">
                    <h2 className="text-foreground-400 text-xl">
                      Reward Amount
                    </h2>
                    <h1 className="font-mono text-5xl">
                      {repo.reward_per_pull_request}
                    </h1>
                  </CardBody>
                </Card>
                <Card className="md:w-1/4 bg-transparent mt-4 md:mt-0 border-2 border-slate-400/10">
                  <CardBody className="flex items-center justify-center p-10 gap-4">
                    <h2 className="text-foreground-400 text-xl">View Github</h2>
                    <Button
                      size="lg"
                      radius="lg"
                      color="success"
                      variant="ghost"
                      isIconOnly
                      className="opacity-50"
                      onClick={() => {
                        router.push(repo.repo_url);
                      }}
                    >
                      <SquareArrowOutUpRight size={18} />
                    </Button>
                  </CardBody>
                </Card>
              </div>
              {repo.owner_wallet_address === publicKey?.toString() ? (
                <Card className="border-2 bg-transparent border-slate-400/10 mt-4">
                  <CardBody className="p-10 flex">
                    <p>Repo Balance : {repoBalance} SOL</p>
                    <Button
                      onClick={() =>
                        smartContractService.loadBountyRepo(
                          repo.id,
                          publicKey,
                          0.3
                        )
                      }
                    >
                      Add SOL
                    </Button>
                  </CardBody>
                </Card>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RepositoryDetail;
