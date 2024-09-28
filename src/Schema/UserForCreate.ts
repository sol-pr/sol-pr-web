export class UserForCreate {
  github_username: string = "";
  pubkey: Uint8Array = new Uint8Array(32);



  constructor(fields: { github_username: string; pubkey: Uint8Array; } | undefined = undefined) {
    if (fields) {
      this.github_username = fields.github_username;
      this.pubkey = fields.pubkey;
    }
  }
}

export const UserForCreateShema = new Map([
  [UserForCreate, {
    kind: "struct",
    fields: [
      ["github_username", "String"],
      ["pubkey", ["u8", 32]],
    ]
  }]
]);
