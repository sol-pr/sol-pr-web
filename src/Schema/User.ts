import { serialize, deserialize, Schema } from "borsh";

export class User {
    user_name: string = "";
    phantom_wallet: Uint8Array = new Uint8Array(32);

    constructor(user_name: string, phantom_wallet: Uint8Array) {
        this.user_name = user_name;
        this.phantom_wallet = phantom_wallet;
    }
}


export const UserSchema = new Map([
    [User, {
        kind: "struct",
        fields: [
            ["user_name", "String"],
            ["phantom_wallet", ["u8", 32]],
        ]
    }]
])