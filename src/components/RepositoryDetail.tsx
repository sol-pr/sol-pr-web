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
import { Input } from "@nextui-org/input";

interface Props {
  repo: RepositoryModel;
}

const RepositoryDetail = ({ repo }: Props) => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const wallet = useWallet();
  const [repoBalance, setRepoBalance] = useState<number>();
  const [inputValue, setInputValue] = useState("");
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
            <div className="flex flex-col w-full md:w-1/4 gap-4">
              <Card className="border-2 w-f bg-transparent border-slate-400/10">
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
                  <span className="font-mono">Description: </span>
                  <p className="text-foreground-400">
                    {repo.repo_description}...
                  </p>
                  <span className="text-primary-500 hover:text-primary-300">
                    <span className="text-foreground-500">created by: </span>{" "}
                    {repo.owner_wallet_address.slice(0, 8)}...
                  </span>{" "}
                </CardBody>
              </Card>
              <Card className="border-2 bg-transparent border-slate-400/10">
                <CardBody className="p-10">
                  <p className="font-mono">comming soon!</p>
                </CardBody>
              </Card>
            </div>

            <div className="md:w-3/4">
              <div className="flex flex-col md:flex md:flex-row gap-4 ">
                {" "}
                <Card className="w-full md:w-1/3 bg-transparent md:mt-0 border-2 border-slate-400/10">
                  <CardBody className="flex  items-center justify-center p-10 gap-4">
                    <h2 className="text-foreground-400 text-xl">
                      Total PR Count
                    </h2>
                    <h1 className="font-mono text-5xl">
                      {repo.total_pull_requests}
                    </h1>
                  </CardBody>
                </Card>
                <Card className="md:w-1/3 bg-transparent mt-4 md:mt-0 border-2 border-slate-400/10">
                  <CardBody className="flex items-center justify-center p-10 gap-4">
                    <h2 className="text-foreground-400 text-xl">PR/Reward</h2>
                    <h1 className="font-mono text-2xl">
                      {repo.pull_request_limit} / ◎
                      {repo.reward_per_pull_request}
                    </h1>
                  </CardBody>
                </Card>
                {repo.owner_wallet_address === publicKey?.toString() ? (
                  <Card className="md:w-2/3 bg-transparent mt-4 md:mt-0 border-2 border-slate-400/10">
                    <CardBody className="flex items-center justify-center p-10 gap-4">
                      <h1 className="font-mono text-3xl"> ◎{repoBalance}</h1>
                      <div className="flex gap-2">
                        <Input
                          placeholder="◎ 1"
                          onChange={(e) => setInputValue(e.target.value)}
                        ></Input>
                        <Button
                          onClick={() =>
                            smartContractService
                              .loadBountyRepo(
                                repo.id,
                                publicKey,
                                wallet,
                                parseFloat(inputValue)
                              )
                              .then(() => window.location.reload())
                          }
                          color="success"
                        >
                          Add SOL
                        </Button>
                      </div>
                      <p className="text-sm text-foreground-400">
                        There is commission like 5% of your loading bounty
                      </p>
                    </CardBody>
                  </Card>
                ) : (
                  <Card className="md:w-1/3 bg-transparent mt-4 md:mt-0 border-2 border-slate-400/10">
                    <CardBody className="flex items-center justify-center p-10 gap-4">
                      <h2 className="text-foreground-400 text-xl">
                        View Github
                      </h2>
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
                )}
              </div>
              {repo.owner_wallet_address === publicKey?.toString() ? (
                <Card className="border-2 bg-transparent border-slate-400/10 mt-4">
                  <CardBody className="p-10 flex">Comming Coon!</CardBody>
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
