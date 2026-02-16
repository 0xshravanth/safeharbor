import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        const image = "https://arweave.net/2Ez9icWDenUNoLebo7xbiA3MGDCUXYF7LmNxHiu9zX8S";
        
        const metadata = {
            name: "FAi NFT",
            symbol: "FAi",
            description: "A unique NFT created for the Turbin3 program on Solana devnet",
            image: image,
            attributes: [
                { trait_type: 'Program', value: 'Turbin3' },
                { trait_type: 'Network', value: 'Devnet' },
                { trait_type: 'Rarity', value: 'Common' }
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: [
                {
                    address: keypair.publicKey,
                    share: 100
                }
            ]
        };
        
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
