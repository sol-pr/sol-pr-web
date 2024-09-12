import { PrCount, PrCountSchema } from "@/Schema/PrCount";
import { User, UserSchema } from "@/Schema/User";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { serialize, deserialize } from "borsh";

export class SmartContractService {

    //program_id = new PublicKey("6mqu7HFkZEqHebJrZ77L7zReTCCnJsW89YyLFn7bmMHf");
    //privateKey = [];
    //payer = Keypair.fromSecretKey(Uint8Array.from(this.privateKey));
    //connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    async createUser(username: string, pubkey: Uint8Array): Promise<boolean> {
        return true;

        // const user = new User(username, pubkey);

        // const encodedUser = serialize(UserSchema, user);

        // const concat = Uint8Array.of(0, ...encodedUser);

        // const userPda = PublicKey.findProgramAddressSync([Buffer.from("user_pda"), Buffer.from(pubkey)], this.program_id);

        // const instruction = new TransactionInstruction({
        //     keys: [
        //         { pubkey: this.payer.publicKey, isSigner: true, isWritable: true },
        //         { pubkey: userPda[0], isSigner: false, isWritable: true },
        //         { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        //     ],
        //     data: Buffer.from(concat),
        //     programId: this.program_id,
        // });

        // const message = new TransactionMessage({
        //     instructions: [instruction],
        //     payerKey: this.payer.publicKey,
        //     recentBlockhash: (await this.connection.getLatestBlockhash()).blockhash,
        // }).compileToV0Message();

        // const tx = new VersionedTransaction(message);

        // tx.sign([this.payer]);
        // this.connection.sendTransaction(tx);

        // return true;
    }


    async checkUser(publickey: PublicKey): Promise<boolean> {
        return false;
    }

}
