import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import wallet from "../turbin3-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    try {
        const metadataUri = "https://arweave.net/DUh1HjpFyPL6vepVyKswkE2yAY4uPbWapTecSasRX1VT";
        
        let tx = createNft(umi, {
            mint: mint,
            name: "FAi NFT",
            symbol: "FAi",
            uri: metadataUri,
            sellerFeeBasisPoints: percentAmount(5.5),
            creators: [
                {
                    address: umi.identity.publicKey,
                    verified: true,
                    share: 100
                }
            ]
        });
        
        let result = await tx.sendAndConfirm(umi);
        const signature = base58.encode(result.signature);
        
        console.log(`Successfully Minted  TX :\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
        console.log("Mint Address: ", mint.publicKey);
    } catch(error) {
        console.log("Error minting NFT:", error);
    }
})();
