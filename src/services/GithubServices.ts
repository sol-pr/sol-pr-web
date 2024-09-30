import { GithubRepo } from "@/Schema/Repository";

export class GitGubServices {
    async getRepos() {
        const response = await fetch('https://api.github.com/users/bgraokmush/repos');
        console.log(response);
        return response.json();

    }

    async getRepoDetails(username: string, repoUrl: string): Promise<GithubRepo> {
        const repoName = repoUrl.split('/').pop();

        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        const data = await response.json();


        const returnRepo: GithubRepo = new GithubRepo();
        returnRepo.id = data.id.toString();
        returnRepo.repo_url = data.html_url;
        returnRepo.repo_name = data.name;
        returnRepo.repo_description = data.description || " ";
        returnRepo.owner_wallet_address = new Uint8Array(32);
        returnRepo.pull_request_limit = BigInt(0);
        returnRepo.reward_per_pull_request = BigInt(0);
        returnRepo.total_pull_requests = BigInt(0);


        return returnRepo;

    }
}