import { Lucid, Blockfrost, fromText } from "lucid-cardano";

// Initialize Lucid
const initLucid = async () => {
  const lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "preprodN1EZYj11zL89jJeaAjeRybxYMLp7grmn"
    ),
    "Preprod"
  );
  
  await lucid.selectWalletFromSeed("material chat insane area spatial when can clutch badge notable sing napkin goddess double check mandate thought bicycle spatial notable vendor judge donor liar");
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

    // Get current slot for timing calculations
    const currentSlot = lucid.currentSlot();
    const expirySlot = currentSlot + 1000n; // Add 1000 slots for expiry

    // Define a time-locking native script policy
    const mintingPolicy = lucid.utils.nativeScriptFromJson({
      type: "all",
      scripts: [
        { type: "sig", keyHash: paymentCredential.hash },
        {
          type: "before",
          slot: expirySlot, // Use BigInt slot number instead of Unix time conversion
        },
      ],
    });

    // Get the policy ID
    const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);
    
    // Create asset name and unit
    const assetName = fromText("SumitNFT");
    const unit = policyId + assetName;
    
    console.log("Policy ID:", policyId);
    console.log("Unit:", unit);

    // NFT Metadata (CIP-25)
    const metadata = {
      721: {
        [policyId]: {
          SumitNFT: {
            name: "My First NFT SumitNFT",
            image: "ipfs://bafybeiddeoop6bydzdoqxv4audn42u57wjnv4ntfofr34xtlq5igxcwkba", // Note: Changed to ipfs:// protocol
            description: "This is my first minted NFT on Cardano!",
            mediaType: "image/png",
            otherProperties: {
              artist: "Sumit Bera",
              collection: "My NFT Collection",
            },
          },
        },
      },
    };

    // Calculate validity interval
    const validityRange = {
      validFrom: currentSlot,
      validTo: currentSlot + 100n, // Add 100 slots for transaction validity
    };

    // Mint the NFT with metadata
    const tx = await lucid
      .newTx()
      .mintAssets({ [unit]: 1n })
      .attachMetadata(721, metadata[721]) // Changed to use proper metadata format
      .validFrom(validityRange.validFrom)
      .validTo(validityRange.validTo)
      .attachMintingPolicy(mintingPolicy)
      .complete();

    // Sign and submit the transaction
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    
    console.log("Mint NFT Transaction Hash:", txHash);
    return txHash;
  } catch (error) {
    console.error("Error while minting NFT:", error);
    throw error; // Re-throw the error for better error handling
  }
};

// Execute Minting
mintNFT().catch(console.error);