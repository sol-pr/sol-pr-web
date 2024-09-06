import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";


export const getAirdropOnClick = async () => {

    const { connection } = useConnection();
    const { publicKey } = useWallet();
    try {
        if (!publicKey) {
            throw new Error("Wallet is not Connected");
        }
        const [latestBlockhash, signature] = await Promise.all([
            connection.getLatestBlockhash(),
            connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL),
        ]);
        const sigResult = await connection.confirmTransaction(
            { signature, ...latestBlockhash },
            "confirmed",
        );
        if (sigResult) {
            alert("Airdrop was confirmed!");
        }
    } catch (err) {
        alert("You are Rate limited for Airdrop");
    }
};