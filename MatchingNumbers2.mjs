import { Lucid, Blockfrost, Data } from "lucid-cardano";

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

// Matching Number Validator Script
const matchingNumberScript = {
  type: "PlutusV2",
  script: "5840583e010000332222253355335333573466e1cdd6801240c800a008200a266ae7124110496e636f72726563742067756573732100004112001161220021220011"

};

const main = async () => {
  try {

    // Initialize Lucid
    const lucid = await initLucid();

    // Derive script address
    const matchingNumberAddress = lucid.utils.validatorToAddress(matchingNumberScript);
    console.log("Plutus Script Address:", matchingNumberAddress);

    // Lock ADA at the script
    const lockFunds = async (numberToLock) => {
        console.log("Datum:", Data.to(BigInt(numberToLock)));
      const tx = await lucid
        .newTx()
        .payToContract(
          matchingNumberAddress,
          { inline: Data.to(BigInt(numberToLock)) }, // Store number as inline datum
          { lovelace: 3000000n } // Lock 3 ADA
        )
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();

      console.log("Funds locked with transaction:", txHash);
      return txHash;
    };

    // Redeem ADA from the script
    const redeemFunds = async (numberToRedeem) => {
        console.log("Redeemer:", Data.to(BigInt(numberToRedeem)));
      // Fetch UTxOs at the script address
      const [scriptUtxo] = await lucid.utxosAt(matchingNumberAddress);

      if (!scriptUtxo) {
        throw new Error("No UTXOs found at the script address");
      }

      const tx = await lucid
        .newTx()
        .collectFrom([scriptUtxo], Data.to(BigInt(numberToRedeem))) // Redeem using matching number
        .attachSpendingValidator(matchingNumberScript) // Attach validator script
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();

      console.log("Funds redeemed with transaction:", txHash);
      return txHash;
    };

    // Lock and redeem process
    // const lockedTx = await lockFunds(100); // Lock ADA with datum 100
    // console.log("Lock Transaction Hash:", lockedTx);

    // Wait for confirmation (optional, depending on your setup)
    console.log("Waiting for confirmation...");
    // await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds

    const redeemedTx = await redeemFunds(50); // Redeem using matching redeemer 100
    console.log("Redeem Transaction Hash:", redeemedTx);

  } catch (error) {
    console.error("Error:", error.message || error);
  }
};

main();


// sumit-bera@sumit-bera-Latitude-3430:~/main_projects/sumit-lucid$ node MatchingNumbers2.mjs 
// Plutus Script Address: addr_test1wzcya664ez773kpaq4ncfu9p2lra9gc5etctj7xhezhfp8g344adz
// Datum: 1864
// Funds locked with transaction: 783b415b0a00029343939bc0428adf62811f39d9d43251310ac455bbf875baa1
// Lock Transaction Hash: 783b415b0a00029343939bc0428adf62811f39d9d43251310ac455bbf875baa1
// Waiting for confirmation...
// Redeemer: 1832
// Funds redeemed with transaction: f3861314126df5927eb01299cbbd58304c71c0402316f38da23f026249df0e0e
// Redeem Transaction Hash: f3861314126df5927eb01299cbbd58304c71c0402316f38da23f026249df0e0e
// sumit-bera@sumit-bera-Latitude-3430:~/main_projects/sumit-lucid$ node MatchingNumbers2.mjs 
// Plutus Script Address: addr_test1wzcya664ez773kpaq4ncfu9p2lra9gc5etctj7xhezhfp8g344adz
// Datum: 1864
// Funds locked with transaction: 2520fefdc302e767308c28ba11e5bc349f2b863b123531c7ced8be8d9dce01f9
// Lock Transaction Hash: 2520fefdc302e767308c28ba11e5bc349f2b863b123531c7ced8be8d9dce01f9
// Waiting for confirmation...
// Redeemer: 1896
// Error: failed script execution
//      Spend[0] the validator crashed / exited prematurely
//         Trace Incorrect guess!
// sumit-bera@sumit-bera-Latitude-3430:~/main_projects/sumit-lucid$ 