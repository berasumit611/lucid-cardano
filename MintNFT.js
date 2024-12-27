import { Lucid , Blockfrost, fromText} from "lucid-cardano";

// Initialize Lucid
const initLucid = async () => {
  const lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "preprodN1EZYj11zL89jJeaAjeRybxYMLp7grmn"
    ),
    "Preprod"
  );

  lucid.selectWalletFromSeed("material chat insane area spatial when can clutch badge notable sing napkin goddess double check mandate thought bicycle spatial notable vendor judge donor liar")

  return lucid;
};

// Mint NFT Logic
const mintNFT = async () => {
  try {
    const lucid = await initLucid();

    // Get wallet details
    const { paymentCredential } = lucid.utils.getAddressDetails(
      await lucid.wallet.address()
    );

    // Define a time-locking native script policy
    const mintingPolicy = lucid.utils.nativeScriptFromJson({
      type: "all",
      scripts: [
        { type: "sig", keyHash: paymentCredential.hash },
        {
          type: "before",
          slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000),
        },
      ],
    });

    // Get the policy ID
    const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);

    // Define the asset (unit name) for the NFT
    const nameOfAsset = fromText("SumitNFT");
    const unit = policyId + nameOfAsset;

    console.log("Policy ID:", policyId);
    console.log("Unit:", unit);

    // NFT Metadata (CIP-25)
    const metadata = {
      721: {
        policyId: {
          nameOfAsset: {
            name: "My First NFT SumitNFT",
            image: "https://ipfs.io/ipfs/bafybeiddeoop6bydzdoqxv4audn42u57wjnv4ntfofr34xtlq5igxcwkba", // Replace with your IPFS CID
            description: "This is my first minted NFT on Cardano!",
            mediaType: "image/png", // Ensure it matches your uploaded file type
            otherProperties: {
              artist: "Sumit Bera",
              collection: "My NFT Collection",
            },
          },
        },
      },
    };

    // Mint the NFT with metadata
    const tx = await lucid
      .newTx()
      .mintAssets({ [unit]: 1n }) // Mint 1 unit of the NFT
      .attachMetadata(metadata)
      .validTo(Date.now() + 200000) // Ensure validity for a certain time
      .attachMintingPolicy(mintingPolicy) // Attach minting policy
      .complete();

    // Sign and submit the transaction
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    console.log("Mint NFT Transaction Hash:", txHash);
    return txHash;
  } catch (error) {
    console.error("Error while minting NFT:", error);
  }
};

// Execute Minting
mintNFT().catch(console.error);
