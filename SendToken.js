import { Lucid ,Blockfrost, fromText} from "lucid-cardano";

const policyId = "ba5a91206cdb4850b05d6bd952c5862c61ccd84d5ae5f47a740acc56";
const assetName = "SumitToken";

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




const sendTokens = async () => {
    try {
      const lucid = await initLucid();
      const tx = await lucid.newTx()
      .payToAddress("addr_test1qznl6ehymnju4m5lrykhstychgfcnpf0yymwn4yslzv96whv0dpa5rfnaxu5dtunn7a2ynkzgmp82v76kamfw5j478wqpkhv50", { [policyId + fromText(assetName)]: 10n })
      .complete();
    
    const signedTx = await tx.sign().complete();
    
    const txHash = await signedTx.submit();
  
      console.log("Send Transaction Hash:", txHash); // Send Transaction Hash: e723886100dfa63dc07774aace1d017895fb80b4fdafa0d120cad2b256e9493d
      return txHash;
    } catch (error) {
      console.error("Error while minting tokens:", error);
    }
  };
  
  // Execute Minting
  sendTokens().catch(console.error);