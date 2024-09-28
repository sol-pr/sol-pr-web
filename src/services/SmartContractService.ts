
import { UserResponse } from "@/Schema/models/User/UserResponse";
import { User, UserShema } from "@/Schema/User";
import { UserForCreate, UserForCreateShema } from "@/Schema/UserForCreate";
import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { deserialize, serialize } from "borsh";
export class SmartContractService {

    connection: Connection;
    privatekey: number[];
    payer: Keypair;
    programId: PublicKey;

    constructor() {
        this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        this.privatekey = JSON.parse(process.env.NEXT_PUBLIC_PRIVATE_KEY || "[]");
        this.payer = Keypair.fromSecretKey(Uint8Array.from(this.privatekey));
        this.programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || "");
    }


    // checkUser eğer false dönerse bu metod tetiklenecek
    async createUser(github_username: string, pubkey: Uint8Array): Promise<boolean> {
        try {
            const userCreate = new UserForCreate({ github_username, pubkey });

            const encoded = serialize(UserForCreateShema, userCreate);
            const concat = Uint8Array.of(1, ...encoded);

            const userPDA = PublicKey.findProgramAddressSync([Buffer.from("user_pda"), Buffer.from(pubkey)], this.programId);


            const instruction = new TransactionInstruction({
                keys: [
                    { pubkey: this.payer.publicKey, isSigner: true, isWritable: true },
                    { pubkey: userPDA[0], isSigner: false, isWritable: true },
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },

                ],
                data: Buffer.from(concat),
                programId: this.programId
            });

            const message = new TransactionMessage({
                instructions: [instruction],
                payerKey: this.payer.publicKey,
                recentBlockhash: (await this.connection.getLatestBlockhash()).blockhash
            }).compileToV0Message();

            const tx = new VersionedTransaction(message);
            tx.sign([this.payer]);

            this.connection.sendTransaction(tx);
            console.log("New users account => " + userPDA[0]);
            return true;
        } catch (error) {
            return false;
        }
    }


    // Kullanıcının var olup olmadığını kontrol eder
    async getUser(publickey: Uint8Array): Promise<UserResponse> {

        const publicKey = PublicKey.findProgramAddressSync([Buffer.from("user_pda"), Buffer.from(publickey)], this.programId);
        const user_read = await this.connection.getAccountInfo(publicKey[0]);

        if (user_read == null)
            return { isSuccessful: false, message: "User not found", user: null };

        const user_deserialized = deserialize(UserShema, User, user_read.data);

        console.log("CurrentUser->", user_deserialized.github_username.toString());

        return { isSuccessful: true, message: "user successfuly get.", user: user_deserialized };

    }

}
