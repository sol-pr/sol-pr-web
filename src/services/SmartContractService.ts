
import { LoadBounty, LoadBountyShema } from "@/Schema/LoadBounty";
import { UserResponse } from "@/Schema/models/User/UserResponse";
import { PrCountAccess, PrCountAccessShema } from "@/Schema/PrCountAccess";
import { GithubRepo, GithubRepoShema } from "@/Schema/Repository";
import { User, UserShema } from "@/Schema/User";
import { UserForCreate, UserForCreateShema } from "@/Schema/UserForCreate";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SendTransactionError, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction, TransactionMessage, VersionedTransaction, Transaction, sendAndConfirmTransaction, } from "@solana/web3.js";
import { deserialize, serialize } from "borsh";
import toast from "react-hot-toast";
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

    async sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
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

    async checkUser(github_username: String): Promise<boolean> {
        const accounts = await this.connection.getProgramAccounts(this.programId);

        const users: User[] = [];

        for (let account of accounts) {
            // User PDA adresini ve veriyi kontrol etmek için deserialize et
            const userData = deserialize(
                UserShema,
                User,
                account.account.data
            );
            users.push(userData);
        }

        if (users.find((user) => user.github_username === github_username) != null) {
            return true;
        }
        return false;

    }
    async createRepository(repo: GithubRepo): Promise<boolean> {

        try {
            const encoded = serialize(GithubRepoShema, repo);
            const concat = Uint8Array.of(3, ...encoded);

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
                console.log("Error creating repository:", error);
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
            console.error("Error creating repository:", error);
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
                console.log("RepoData->", repoData);
                githubRepos.push(repoData);
            } catch (err) {
                console.error("Error deserializing account data:", err);
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

        const pubkey = new PublicKey(repo_deserialized.owner_wallet_address);
        console.log("CurrentRepo->", pubkey.toBase58());
        return repo_deserialized;
    }
    async getRepoBalace(id: string): Promise<number> {
        // 1. GitHub repo PDA'sını oluştur
        const githubRepoPDA = PublicKey.findProgramAddressSync([Buffer.from("repo_wallet"), Buffer.from(id)], this.programId);


        const wallet = new PublicKey(githubRepoPDA[0]);
        const balanceLamports = await this.connection.getBalance(wallet);

        // 2. Bakiyeyi SOL cinsine çevir (1 SOL = 1,000,000,000 lamports)
        return balanceLamports / LAMPORTS_PER_SOL;
    }

    async loadBountyRepo(id: string, phantomWallet: PublicKey, wallet: WalletContextState, amount: number) {
        try {
            // Cüzdan bağlı mı?
            if (!wallet.connected) {
                throw new Error("Wallet is not connected. Please connect your wallet.");
            }

            // Cüzdan işlem imzalamayı destekliyor mu?
            if (!wallet.signTransaction) {
                throw new Error("Your wallet does not support transaction signing.");
            }

            const repoPDA = PublicKey.findProgramAddressSync([Buffer.from("repo_pda"), Buffer.from(id)], this.programId);

            const repoWalletPDA = PublicKey.findProgramAddressSync([Buffer.from("repo_wallet"), Buffer.from(id)], this.programId);

            const loadBounty = new LoadBounty({ amount: BigInt(amount * LAMPORTS_PER_SOL) });
            console.log("Amount => ", loadBounty.amount);

            const encoded = serialize(LoadBountyShema, loadBounty);
            const concat = Uint8Array.of(5, ...encoded);

            const ownerWallet = new PublicKey("3FVfhromrZ4cdjb38kfp8R4EC5NHvdABRtKZqxumwVSM")


            const instruction = new TransactionInstruction({
                keys: [
                    { pubkey: phantomWallet, isSigner: true, isWritable: true },
                    { pubkey: ownerWallet, isSigner: false, isWritable: true },
                    { pubkey: repoWalletPDA[0], isSigner: false, isWritable: true },
                    { pubkey: repoPDA[0], isSigner: false, isWritable: true },
                    { pubkey: this.payer.publicKey, isSigner: true, isWritable: true },
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },

                ],
                data: Buffer.from(concat),
                programId: this.programId
            })


            const message = new TransactionMessage({
                instructions: [instruction],
                payerKey: this.payer.publicKey,
                recentBlockhash: (await this.connection.getLatestBlockhash()).blockhash,
            }).compileToV0Message();

            const tx = new VersionedTransaction(message);



            tx.sign([this.payer]);


            // İşlemi imzala
            const signedTransaction = await wallet.signTransaction(tx);

            // İşlemi gönder
            const sig = await this.connection.sendRawTransaction(
                signedTransaction.serialize()
            );

            toast.success("Bounty loaded successfully");
            toast.success(sig);
            console.log("Bounty loaded successfully. TX Signature:", sig);

        } catch (error: any) {
            console.error("Error loading bounty:", error);
            toast.error("Error loading bounty");
        }
    }
    async increasePullRequestCount(user: PublicKey,
        githubRepoId: string) {

        const prCounterPDA = PublicKey.findProgramAddressSync(
            [
                Buffer.from("pull request counter"),
                Buffer.from(user.toBytes()),
                Buffer.from(githubRepoId)
            ],
            this.programId
        );

        const prCounterAccount = await this.connection.getAccountInfo(prCounterPDA[0]);
        if (prCounterAccount == null) {
            // create new account
            const prCountAccess = new PrCountAccess();
            prCountAccess.id = githubRepoId;
            prCountAccess.phantom_wallet = user.toBytes();

            //for create new account
            const encoded = serialize(PrCountAccessShema, prCountAccess);
            const concat = Uint8Array.of(0, ...encoded);

            const instruction = new TransactionInstruction({
                keys: [
                    { pubkey: this.payer.publicKey, isSigner: true, isWritable: true },
                    { pubkey: prCounterPDA[0], isSigner: false, isWritable: true },
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
            console.log("New users account => " + prCounterPDA[0])

            return true;
        }
        else {
            const prCountAccess = new PrCountAccess();
            prCountAccess.id = githubRepoId;
            prCountAccess.phantom_wallet = user.toBytes();

            //for create new account
            const encoded = serialize(PrCountAccessShema, prCountAccess);
            const concat = Uint8Array.of(1, ...encoded);

            const instruction = new TransactionInstruction({
                keys: [
                    { pubkey: this.payer.publicKey, isSigner: true, isWritable: true },
                    { pubkey: prCounterPDA[0], isSigner: false, isWritable: true },
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
            console.log("UpdatesUser => " + prCounterPDA[0])

            return true;

        }
    }

    async transferReward(id: string,
        phantomWallet: PublicKey) {

        try {

            const githubRepoPDA = PublicKey.findProgramAddressSync([Buffer.from("repo_pda"), Buffer.from(id)], this.programId);

            const userPDA = PublicKey.findProgramAddressSync(
                [Buffer.from("user_pda"), Buffer.from(phantomWallet.toBytes())],
                this.programId
            );

            const prCounterPDA = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("pull request counter"),
                    Buffer.from(phantomWallet.toBytes()),
                    Buffer.from(id)
                ],
                this.programId
            );

            const repoWalletPda = PublicKey.findProgramAddressSync([Buffer.from("repo_wallet"), Buffer.from(id)], this.programId);

            const instruction = new TransactionInstruction({
                keys: [
                    { pubkey: this.payer.publicKey, isSigner: true, isWritable: true },
                    { pubkey: githubRepoPDA[0], isSigner: false, isWritable: true },
                    { pubkey: userPDA[0], isSigner: false, isWritable: true },
                    { pubkey: phantomWallet, isSigner: false, isWritable: true },
                    { pubkey: prCounterPDA[0], isSigner: false, isWritable: true },
                    { pubkey: repoWalletPda[0], isSigner: false, isWritable: true },
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
                ],
                data: Buffer.from([7]),
                programId: this.programId
            });

            const latestBlockhash = await this.connection.getLatestBlockhash();
            const message = new TransactionMessage({
                instructions: [instruction],
                payerKey: this.payer.publicKey,
                recentBlockhash: latestBlockhash.blockhash
            }).compileToV0Message();


            const transaction = new VersionedTransaction(message);
            transaction.sign([this.payer]);

            const txSignature = await this.connection.sendTransaction(transaction);

            console.log("Transfer işlemi başarılı. TX Signature:", txSignature);
            toast.success("Reward transferred successfully");
        } catch (error) {
            console.error("Error loading bounty:", error);
            toast.error("Error loading bounty");
        }

    }


}
