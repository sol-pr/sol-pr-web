export class PrCountAccess {
    id: string = "";
    phantom_wallet: Uint8Array = new Uint8Array(32);



    constructor(fields: { id: string; phantom_wallet: Uint8Array; } | undefined = undefined) {
        if (fields) {
            this.id = fields.id;
            this.phantom_wallet = fields.phantom_wallet;
        }
    }
}

export const PrCountAccessShema = new Map([
    [PrCountAccess, {
        kind: "struct",
        fields: [
            ["id", "String"],
            ["phantom_wallet", ["u8", 32]],
        ]
    }]
]);