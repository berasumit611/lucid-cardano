import { Lucid, Blockfrost, Data } from "lucid-cardano";

// Initialize Lucid with Blockfrost
const initLucid = async () => {
  const lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "preprodN1EZYj11zL89jJeaAjeRybxYMLp7grmn"
    ),
    "Preprod"
  );

  // Load your wallet
  const api = await window.cardano.nami.enable();
  lucid.selectWallet(api);
  
  return lucid;
};

// Validator Script (replace with your compiled CBOR hex)
const matchingNumberScript = {
  type: "PlutusV2",
  script: "58ce58cc01000033232323222225335333573466e3d4cd4cc8005401800c840044c98c8018cd5ce2490c496e76616c69642064617461000073724a66a664002a00c00442002264c6400c66ae71240110496e76616c69642072656465656d65720000712200212200110071326320063357389201035054350000749848ccccccd5d20009280212802128021280211909118010019bae002002120011122001335122330024891ca8bc76574af70dd8784a78b753a342b2a57bd302578f6fb827aacaed00480008848cc00400c0088005" // Your CBOR hex from the Haskell compilation
};

// Main interaction functions
const contractInteractions = async () => {
  try {
    // Initialize Lucid
    const lucid = await initLucid();
    
    // Get validator address
    const matchingNumberAddress = lucid.utils.validatorToAddress(matchingNumberScript);

    console.log(matchingNumberAddress);
    
    // Lock funds function
    const lockFunds = async (numberToLock) => {
      console.log(`Locking funds with number: ${numberToLock}`);
      
      const tx = await lucid
        .newTx()
        .payToContract(
          matchingNumberAddress, 
          { inline: Data.to(BigInt(numberToLock)) }, 
          { lovelace: BigInt(2000000) }  // 2 ADA
        )
        .complete();
      
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      
      console.log("Lock Transaction submitted:", txHash);
      return txHash;
    };

    // Redeem funds function
    const redeemFunds = async (numberToRedeem) => {
      console.log(`Attempting to redeem with number: ${numberToRedeem}`);
      
      // Get UTXOs at the script address
      const scriptUtxos = await lucid.utxosAt(matchingNumberAddress);
      
      if (scriptUtxos.length === 0) {
        throw new Error("No UTXOs found at script address");
      }

      const tx = await lucid
        .newTx()
        .collectFrom(
          scriptUtxos,
          Data.to(BigInt(numberToRedeem))
        )
        .attachSpendingValidator(matchingNumberScript)
        .complete();
      
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      
      console.log("Redeem Transaction submitted:", txHash);
      return txHash;
    };

    // Get script UTxOs
    const getScriptUtxos = async () => {
      const utxos = await lucid.utxosAt(matchingNumberAddress);
      return utxos.map(utxo => ({
        txHash: utxo.txHash,
        outputIndex: utxo.outputIndex,
        assets: utxo.assets,
        datum: utxo.datum
      }));
    };

    return {
      lockFunds,
      redeemFunds,
      getScriptUtxos,
      matchingNumberAddress
    };
  } catch (error) {
    console.error("Error in contract interactions:", error);
    throw error;
  }
};

// Usage example
const main = async () => {
  try {
    const contract = await contractInteractions();
    
    // Example: Lock funds with number 100
    const lockTxHash = await contract.lockFunds(100);
    console.log("Locked funds with tx:", lockTxHash);
    
    // Wait for transaction confirmation (you might want to implement proper waiting logic)
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Check UTXOs at script address
    const utxos = await contract.getScriptUtxos();
    console.log("UTXOs at script address:", utxos);
    
    // Example: Redeem funds with matching number 100
    const redeemTxHash = await contract.redeemFunds(100);
    console.log("Redeemed funds with tx:", redeemTxHash);
    
  } catch (error) {
    console.error("Error in main:", error);
  }
};

// Error handler wrapper
window.onload = () => {
  main().catch(console.error);
};