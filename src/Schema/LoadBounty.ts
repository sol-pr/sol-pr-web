export class LoadBounty {
    amount: bigint = BigInt(0);

    constructor(fields: { amount: bigint } | undefined = undefined) {
        if (fields) {
            this.amount = fields.amount;
        }
    }
}

export const LoadBountyShema = new Map([
    [LoadBounty, {
        kind: "struct",
        fields: [
            ["amount", "u64"],
        ]
    }]
]);
