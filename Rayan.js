import { Blockfrost, fromText, Lucid } from "lucid-cardano";

try {
  // Define the metadata details
  // NFT Metadata (CIP-25)
  
  const lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "preprodUFORB61aetgYVPS7c1qGhven5shd9cjE"
    ),
    "Preprod"
  );
  // Select the wallet from seed phrase
  lucid.selectWalletFromSeed(
    "material chat insane area spatial when can clutch badge notable sing napkin goddess double check mandate thought bicycle spatial notable vendor judge donor liar"
  );
  const addr = await lucid.wallet.address();
  console.log(addr, "this is address");
  
  const { paymentCredential } = lucid.utils.getAddressDetails(
    await lucid.wallet.address()
  );
  
  const mintingPolicy = lucid.utils.nativeScriptFromJson({
    type: "all",
    scripts: [
      { type: "sig", keyHash: paymentCredential?.hash },
      {
        type: "before",
        slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000),
      },
    ],
  });
  console.log(mintingPolicy);
  const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);
  console.log(policyId, "my policy id");
  const metadata = {
    721: {
      [policyId]: {
        MyUniqueNFT: {
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

  async function mintNFT(name) {
    const unit = policyId + fromText(name);

    const tx = await lucid
      .newTx()
      .mintAssets({ [unit]: 2n })
      .attachMetadata(metadata)
      .validTo(Date.now() + 100000)
      .attachMintingPolicy(mintingPolicy)
      .complete();

    const signedTx = await tx.sign().complete();

    const txHash = await signedTx.submit();

    return txHash;
  }

  // to check nft minted or not
  const isMinted = await mintNFT("MY_nft");
  console.log(isMinted ? "NFT has been minted" : "NFT has not been minted");
} catch (error) {
  console.log(error);
}
// const policyId: PolicyId = "a4d8bf12129d40b44ce273a0370cd3b7cb834bd8db8cc6381e83f695"
// // get wallet balance
// const utxos = await lucid.wallet.getUtxos();
// console.log(Wallet balance: ${utxos} lovelaces);

// Get the wallet UTxo

// const balance = await lucid.wallet.getUtxos();
// console.log("-------------------------------")
// console.log(balance,"+++++++")

// const assets = await lucid.wallet.Assets();
// console.log(assets);

// get transaction history
// const txHistory = await lucid.wallet.getTxHistory();
// console.log(txHistory,"Transaction history");

// export async function burnNFT(name: string): Promise<TxHash> {
//   const unit: Unit = policyId + fromText(name);

//   const tx = await lucid
//     .newTx()
//     .mintAssets({ [unit]: -1n })
//     .validTo(Date.now() + 100000)
//     .attachMintingPolicy(mintingPolicy)
//     .complete();

//   const signedTx = await tx.sign().complete();

//   const txHash = await signedTx.submit();

//   return txHash;
// }
// const isBurned = await burnNFT("MyNFT");
// console.log(isBurned ? "NFT has been burned" : "NFT has not been burned");

// (module.exports = mintNFT), burnNFT;
