import { GithubRepo } from "@/Schema/Repository";

export class GitGubServices {
    async getRepoDetails(username: string, repoUrl: string): Promise<GithubRepo> {
        const repoName = repoUrl.split('/').pop();
        console.log(`https://api.github.com/repos/${username}/${repoName}`);

        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        const data = await response.json();


        const returnRepo: GithubRepo = new GithubRepo();
        returnRepo.id = String(data.id);
        returnRepo.repo_url = data.html_url;
        returnRepo.repo_name = data.name;
        returnRepo.repo_description = data.description || " ";
        returnRepo.owner_wallet_address = new Uint8Array(32);
        returnRepo.pull_request_limit = BigInt(0);
        returnRepo.reward_per_pull_request = BigInt(0);
        returnRepo.total_pull_requests = BigInt(0);
        returnRepo.repo_wallet_address = new Uint8Array(32);


        return returnRepo;
    }

    async getRepoDetailedInfo(username: string, repoUrl: string): Promise<string> {
    }