export class GithubRepo {
    id: string = "";
    repo_url: string = "";
    repo_name: string = "";
    repo_description: string = "";
    total_pull_requests: bigint = BigInt(0);
    pull_request_limit: bigint = BigInt(0);
    reward_per_pull_request: bigint = BigInt(0);
    owner_wallet_address: Uint8Array = new Uint8Array(32);
    repo_wallet_address: Uint8Array = new Uint8Array(32);

    constructor(fields: { id: string; repo_url: string; repo_name: string; repo_description: string; total_pull_requests: bigint; pull_request_limit: bigint; reward_per_pull_request: bigint; owner_wallet_address: Uint8Array; repo_wallet_address: Uint8Array; } | undefined = undefined) {
        if (fields) {
            this.id = fields.id;
            this.repo_url = fields.repo_url;
            this.repo_name = fields.repo_name;
            this.repo_description = fields.repo_description;
            this.total_pull_requests = fields.total_pull_requests;
            this.pull_request_limit = fields.pull_request_limit;
            this.reward_per_pull_request = fields.reward_per_pull_request;
            this.owner_wallet_address = fields.owner_wallet_address;
            this.repo_wallet_address = fields.repo_wallet_address;

        }
    }
}

export const GithubRepoShema = new Map([
    [GithubRepo, {
        kind: "struct",
        fields: [
            ["id", "String"],
            ["repo_url", "String"],
            ["repo_name", "String"],
            ["repo_description", "String"],
            ["total_pull_requests", "u64"],
            ["pull_request_limit", "u64"],
            ["reward_per_pull_request", "u64"],
            ["owner_wallet_address", ["u8", 32]],
            ["repo_wallet_address", ["u8", 32]],
        ]
    }]
]);