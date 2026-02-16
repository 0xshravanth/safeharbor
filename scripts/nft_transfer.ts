import { Commitment, Connection, Keypair, PublicKey } from "@solana/web3.js"
import wallet from "../turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const mint = new PublicKey("F79RFNevHc9gwVxsyjMdCrecaCKVw6K9de4G9eXbBwfv");
const to = new PublicKey("D7YxUxHrzQvZQc8eyos1VvEroobh3msbtS1go9Tnxdee");

(async () => {
    try {
        const fromWallet = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );

        const toWallet = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to 
        );
        
        const transferSignature = await transfer(
            connection, 
            keypair,
            fromWallet.address,
            toWallet.address,
            keypair,
            1
        );
        
        console.log("NFT Transfer Successful ");
        console.log("From: ", fromWallet.address.toBase58());
        console.log("To: ", toWallet.address.toBase58());
        console.log("Transaction Signature: ", transferSignature);
        console.log(`View on explorer: https://explorer.solana.com/tx/${transferSignature}?cluster=devnet`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
