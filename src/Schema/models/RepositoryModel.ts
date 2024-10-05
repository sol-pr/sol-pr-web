export interface RepositoryModel {
    id: string;
    repo_url: string;
    repo_name: string;
    repo_description: string;
    total_pull_requests: number;
    pull_request_limit: number;
    reward_per_pull_request: number;
    owner_wallet_address: string;
    repo_wallet_address: string;
}