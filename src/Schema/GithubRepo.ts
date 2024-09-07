export class GithubRepo {
    repo_url: string = "";
    total_pull_requests: number = 0;
    pull_requests_limit: bigint = BigInt(0);
    reward_per_pull_request: bigint = BigInt(0);
    owner_wallet_address: Uint8Array = new Uint8Array(32);

    constructor(repo_url: string, total_pull_requests: number, pull_requests_limit: bigint, reward_per_pull_request: bigint, owner_wallet_address: Uint8Array) {
        this.repo_url = repo_url;
        this.total_pull_requests = total_pull_requests;
        this.pull_requests_limit = pull_requests_limit;
        this.reward_per_pull_request = reward_per_pull_request;
        this.owner_wallet_address = owner_wallet_address;
    }
}

export const GithubRepoSchema = new Map([
    [GithubRepo, {
        kind: "struct",
        fields: [
            ["repo_url", "String"],
            ["total_pull_requests", "u8"],
            ["pull_requests_limit", "u64"],
            ["reward_per_pull_request", "u64"],
            ["owner_wallet_address", ["u8", 32]],
        ]
    }]
]);