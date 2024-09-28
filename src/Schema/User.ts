import { serialize, deserialize, Schema } from "borsh";

export class User {
    github_username: string = "";
    phantom_wallet: Uint8Array = new Uint8Array(32);
    totalearn: bigint = BigInt(0);
    submitted_at: bigint = BigInt(0);
    total_pr_count: bigint = BigInt(0);


    constructor(fields: { github_username: string; phantom_wallet: Uint8Array; totalearn: bigint; submitted_at: bigint; total_pr_count: bigint; } | undefined = undefined) {
        if (fields) {
            this.github_username = fields.github_username;
            this.phantom_wallet = fields.phantom_wallet;
            this.totalearn = fields.totalearn;
            this.submitted_at = fields.submitted_at;
            this.total_pr_count = fields.total_pr_count;
        }
    }
}

export const UserShema = new Map([
    [User, {
        kind: "struct",
        fields: [
            ["github_username", "String"],
            ["phantom_wallet", ["u8", 32]],
            ["totalearn", "u64"],
            ["submitted_at", "u64"],
            ["total_pr_count", "u64"],
        ]
    }]
]);