import { Lucid ,Blockfrost, fromText} from "lucid-cardano";

// Initialize Lucid
const initLucid = async () => {
    const lucid = await Lucid.new(
      new Blockfrost(
        "https://cardano-preprod.blockfrost.io/api/v0",
        "preprodN1EZYj11zL89jJeaAjeRybxYMLp7grmn"
      ),
      "Preprod" 
    );
  
    // Connect wallet
    lucid.selectWalletFromSeed("material chat insane area spatial when can clutch badge notable sing napkin goddess double check mandate thought bicycle spatial notable vendor judge donor liar")
  
    return lucid;
  };
// Minting Logic
const mintTokens = async () => {
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

    // Define the asset (unit name)
    const unit = policyId + fromText("SumitToken");

    console.log("Policy ID:", policyId);
    console.log("Unit:", unit);

    // Mint the token
    const tx = await lucid
      .newTx()
      .mintAssets({ [unit]: 100n }) // Mint 100 tokens
      .validTo(Date.now() + 200000) // Ensure validity for a certain time
      .attachMintingPolicy(mintingPolicy) // Attach minting policy
      .complete();

    // Sign and submit the transaction
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    console.log("Mint Transaction Hash:", txHash);
    return txHash;
  } catch (error) {
    console.error("Error while minting tokens:", error);
  }
};

// Execute Minting
mintTokens().catch(console.error);


// Policy ID: ba5a91206cdb4850b05d6bd952c5862c61ccd84d5ae5f47a740acc56
// Unit: ba5a91206cdb4850b05d6bd952c5862c61ccd84d5ae5f47a740acc5653756d6974546f6b656e
// Mint Transaction Hash: d1fc2e3e7f21c2741095b485dd8009988fc718547d371495c1b06ac124148ed1