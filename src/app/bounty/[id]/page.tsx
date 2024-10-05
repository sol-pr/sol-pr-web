"use client";
import RepositoryDetail from "@/components/RepositoryDetail";
import ReturnHome from "@/components/ReturnHome";
import { RepositoryModel } from "@/Schema/models/RepositoryModel";
import { GithubRepo } from "@/Schema/Repository";
import { SmartContractService } from "@/services/SmartContractService";
import { repoSchemaToModel } from "@/services/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = ({ params }: { params: { id: number } }) => {
  const { connected } = useWallet();
  const [repo, setRepo] = useState<RepositoryModel | undefined>(undefined);
  const smartContractService = new SmartContractService();
  const router = useRouter();

  useEffect(() => {
    async function getRepo() {
      try {
        const repoData = await smartContractService.getRepository(
          params.id.toString()
        );

        if (!repoData) {
          // Eğer repoData undefined ise anasayfaya yönlendir.
          router.push("/");
          return;
        }

        // repoSchemaToModel fonksiyonu undefined dönüyorsa anasayfaya yönlendir
        const formattedRepo = repoSchemaToModel(repoData);
        if (!formattedRepo) {
          router.push("/");
          return;
        }

        setRepo(formattedRepo);
      } catch (error) {
        // Olası hatalar için anasayfaya yönlendirme
        console.error("Error fetching repository:", error);
        router.push("/dashboard");
      }
    }

    getRepo();
  }, [params.id, router]); // `router` ve `params.id` dependency'leri eklenmeli

  return (
    <section className="flex justify-center items-center min-h-screen">
      {connected ? (
        repo ? (
          <RepositoryDetail repo={repo} />
        ) : (
          <div>Loading...</div>
        )
      ) : (
        <ReturnHome />
      )}
    </section>
  );
};

export default Page;
