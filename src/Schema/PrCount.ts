export class PrCount {
    prcount: bigint = BigInt(0);

    constructor(prcount: bigint) {
        this.prcount = prcount;
    }
}

export const PrCountSchema = new Map([
    [PrCount, {
        kind: "struct",
        fields: [
            ["prcount", "u64"],
        ]
    }]
]);