import {
    Blockfrost,
    fromText,
    Lucid,
    MintingPolicy,
    PolicyId,
    TxHash,
    Address,
    Unit,
    Metadata,
    Assets
  } from "lucid-cardano";
  
  // Define the metadata details
  const metadata: Metadata = {
    222: {
      name: "NFT",
      description: "This is my NFT",
      image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua"
    },
    333: {}, // Add other metadata labels as required
    444: {}
  };
  
  // Initialize Lucid with Blockfrost API
  const lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "preprodUFORB61aetgYVPS7c1qGhven5shd9cjE"
    ),
    "Preprod"
  );
  
  // Select the wallet from seed phrase (directly including the seed phrase as a string)
  lucid.selectWalletFromSeed("material chat insane area spatial when can clutch badge notable sing napkin goddess double check mandate thought bicycle spatial notable vendor judge donor liar");
  
  // Get wallet address
  const addr: Address = await lucid.wallet.address();
  console.log(addr, "this is address");
  
  // Get payment credentials from the address
  const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address());
  
  // Define the minting policy
  const mintingPolicy: MintingPolicy = lucid.utils.nativeScriptFromJson({
    type: "all",
    scripts: [
      { type: "sig", keyHash: paymentCredential?.hash! },
      {
        type: "before",
        slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000)
      }
    ]
  });
  
  // Define the policy ID
  const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy);
  console.log(policyId, "my policy id");
  
  // Function to mint an NFT
  async function mintNFT(name: string): Promise<TxHash> {
    const unit: Unit = policyId + fromText(name);
  
    try {
      const tx = await lucid
        .newTx()
        .mintAssets({ [unit]: 2n })
        .attachMetadata(222, metadata[222])
        .validTo(Date.now() + 100000) 
        .attachMintingPolicy(mintingPolicy)
        .complete();

       
  
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
  
      return txHash;
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  }
  
  // Function to burn an NFT
  async function burnNFT(name: string): Promise<TxHash> {
    const unit: Unit = policyId + fromText(name);
  
    try {
      const tx = await lucid
        .newTx()
        .mintAssets({ [unit]: -1n }) // Burn 1 unit of the NFT
        .validTo(Date.now() + 100000)
        .attachMintingPolicy(mintingPolicy)
        .complete();
  
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
  
      return txHash;
    } catch (error) {
      console.error("Error burning NFT:", error);
      throw error;
    }
  }
  
  // Mint an NFT and log the result
  async function checkMinting() {
    try {
      const isMinted = await mintNFT("MY_nft");
      console.log(isMinted ? "NFT has been minted" : "NFT has not been minted");
    } catch (error) {
      console.error("Error in minting:", error);
    }
  }
  
  // Burn an NFT and log the result
//   async function checkBurning() {
//     try {
//       const isBurned = await burnNFT("MY_nft");
//       console.log(isBurned ? "NFT has been burned" : "NFT has not been burned");
//     } catch (error) {
//       console.error("Error in burning:", error);
//     }
//   }
  
  // Run minting and burning checks
  checkMinting();
//   checkBurning();
  
  // Exporting the minting and burning functions for external use
  export { mintNFT, burnNFT };
  