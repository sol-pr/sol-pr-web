
import { UserResponse } from "@/Schema/models/User/UserResponse";
import { GithubRepo, GithubRepoShema } from "@/Schema/Repository";
import { User, UserShema } from "@/Schema/User";
import { UserForCreate, UserForCreateShema } from "@/Schema/UserForCreate";
import { clusterApiUrl, Connection, Keypair, PublicKey, SendTransactionError, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { deserialize, serialize } from "borsh";
import toast from "react-hot-toast";
import { Md5 } from "ts-md5";
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
            const concat = Uint8Array.of(2, ...encoded);

            const userPDA = PublicKey.findProgramAddressSync([Buffer.from("user_pda"), Buffer.from(pubkey)], this.programId);


            const instruction = new TransactionInstruction({
                keys: [
                    { pubkey: this.payer.publicKey, isSigner: true, isWritable: true },
                    { pubkey: userPDA[0], isSigner: false, isWritable: true },
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },

                ],
                data: Buffer.from(concat),
                programId: this.programId
            })

            const message = new TransactionMessage({
                instructions: [instruction],
                payerKey: this.payer.publicKey,
                recentBlockhash: (await this.connection.getLatestBlockhash()).blockhash
            }).compileToV0Message();


            const tx = new VersionedTransaction(message);
            tx.sign([this.payer]);

            this.connection.sendTransaction(tx);
            console.log("New users account => " + userPDA[0])

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

    async createRepository(repo: GithubRepo): Promise<boolean> {

        try {
            const encoded = serialize(GithubRepoShema, repo);
            const concat = Uint8Array.of(4, ...encoded);


            const repoPDA = PublicKey.findProgramAddressSync([Buffer.from("repo_pda"), Buffer.from(repo.id)], this.programId);
            const repoWalletPDA = PublicKey.findProgramAddressSync([Buffer.from("repo_wallet"), Buffer.from(repo.id)], this.programId);

            const instruction = new TransactionInstruction({
                keys: [
                    { pubkey: this.payer.publicKey, isSigner: true, isWritable: true },
                    { pubkey: repoPDA[0], isSigner: false, isWritable: true },
                    { pubkey: repoWalletPDA[0], isSigner: false, isWritable: true },
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // System Program
                    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // Rent
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

            const response = await this.connection.sendTransaction(tx).catch((error: SendTransactionError) => {
                //const message = error.logs?.[2];
                const message = "Repository already exists";
                toast.error(message || "", {
                    style: {
                        backgroundColor: "#000",
                        borderBlockStyle: "solid",
                        color: "#fff",
                        border: "2px solid #FFFFFF40",
                    },
                });
                return false;
            });

            if (!response)
                return false;

            console.log("New Repository account => " + repoPDA[0])

            toast.success(repoPDA[0].toString(), {
                style: {
                    backgroundColor: "#000",
                    borderBlockStyle: "solid",
                    color: "#fff",
                    border: "2px solid #FFFFFF40",
                },
            });
            return true;

        }
        catch (error) {
            return false;
        }

    }

    async getAllRepositories(): Promise<GithubRepo[]> {
        const accounts = await this.connection.getProgramAccounts(this.programId);

        const githubRepos: GithubRepo[] = [];

        for (let account of accounts) {
            // Repo PDA adresini ve veriyi kontrol etmek için deserialize et
            try {
                const repoData = deserialize(
                    GithubRepoShema,
                    GithubRepo,
                    account.account.data
                );

                githubRepos.push(repoData);
            } catch (err) {

            }
        }

        console.log("All repos:", githubRepos);
        return githubRepos;
    }

    async getRepository(id: string): Promise<GithubRepo | null> {
        const publicKey = PublicKey.findProgramAddressSync([Buffer.from("repo_pda"), Buffer.from(id)], this.programId);
        const repo_read = await this.connection.getAccountInfo(publicKey[0]);

        if (repo_read == null) {
            return null;
        }
        const repo_deserialized = deserialize(GithubRepoShema, GithubRepo, repo_read.data);
        return repo_deserialized;
    }

}
