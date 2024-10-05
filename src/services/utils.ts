import { RepositoryModel } from "@/Schema/models/RepositoryModel";
import { GithubRepo } from "@/Schema/Repository";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";


export function repoSchemaToModel(GithubRepo: GithubRepo): RepositoryModel {
    const owner = new PublicKey(GithubRepo.owner_wallet_address);
    const repo = new PublicKey(GithubRepo.repo_wallet_address);
    return {
        id: GithubRepo.id,
        repo_url: GithubRepo.repo_url,
        repo_name: GithubRepo.repo_name,
        repo_description: GithubRepo.repo_description,
        total_pull_requests: Number(GithubRepo.total_pull_requests), // bigint -> number
        pull_request_limit: Number(GithubRepo.pull_request_limit), // bigint -> number
        reward_per_pull_request: Number(GithubRepo.reward_per_pull_request) / LAMPORTS_PER_SOL, // bigint -> number
        owner_wallet_address: owner.toBase58().toString(),
        repo_wallet_address: repo.toBase58().toString()
    };
}
