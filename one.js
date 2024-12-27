import { Lucid, Blockfrost } from "lucid-cardano";

const initializeLucid = async() => {
    try {
        // Initialize Lucid
        const lucid = await Lucid.new(
          new Blockfrost(
            "https://cardano-preprod.blockfrost.io/api/v0",
            "preprodN1EZYj11zL89jJeaAjeRybxYMLp7grmn"
          ),
          "Preprod"
        );
        return lucid;
    }catch(e){
        console.error("Error initializing Lucid:", e);
    }
    
}


async function main() {
    try {
        // Wait for Lucid initialization
        const lucid = await initializeLucid();

        // Generate a private key
        const privateKey = lucid.utils.generatePrivateKey(); // Bech32 encoded private key
        console.log("Generated Private Key (Bech32):", privateKey);

        // Generae Seed Phase
        const seedPhrase = lucid.utils.generateSeedPhrase()
        console.log("Seed phrase:", seedPhrase);


        // Now we select a private key wallet with our Lucid instance
        const wallet = lucid.selectWalletFromPrivateKey(privateKey);
        console.log(wallet);

        // Get wallet address
        // const address=await wallet.address();
        const address = await lucid.wallet.address(); // Bech32 address

        console.log("Address:", address);

    } catch (error) {
        console.error("Error in main function:", error);
    }
}

const getBalance = async () => {
    const lucid = await initializeLucid();
    // first fetch exsisting wallet 
    // from private key 
    lucid.selectWalletFromPrivateKey(
        "ed25519_sk1wwm0dtvkq87gg9a2lldzrukyn6a5lemekdtc78em8g8xnwxsthrsesn3na"
    );
    // then from that wallet we get 
    // same generated wallet address
    const address = await lucid.wallet.address(); // Bech32 address
    console.log("Address from private_key:", address);

    // we can also import exsisting wallet 
    // from seed phrase
    lucid.selectWalletFromSeed("tone side reject sport priority rug bachelor prefer blanket table blush supreme finish blame play rib chimney friend such keep gentle man approve ritual");
    const anotherAddress = await lucid.wallet.address();
    console.log("Address from seed:", anotherAddress);

    // import wallet address from nami wallet seed phrase
    lucid.selectWalletFromSeed("chronic negative aisle sugar mother tobacco elephant pitch useless swift wear seven obvious purchase impose nature chapter nuclear trap setup dumb core hybrid slight");
    const newAddress = await lucid.wallet.address();
    console.log("Address from nami_Seed:", newAddress);

    // const api = await window.cardano.nami.enable();
    // lucid.selectWallet(api);

    // Query UTxOs
    const utxos = await lucid.wallet.getUtxos();
    console.log("Utxos of nami_wallet:", utxos);
    

    // Utxos of nami_wallet: [
    //     {
    //       txHash: '9647332851ec9202afa6a131f94c5f2c5d045a94da906d03662da5baf2ee29b7',
    //       outputIndex: 0,
    //       assets: { lovelace: 100000000n },
    //       address: 'addr_test1qrd45jy5ztsnq6037jnw9emu0d8yzcx7dzvkd6pgmsg3s989f4d58eywysu4egmv88de9ydewcefsdm867rgr28mt3xqqxgyds',
    //       datumHash: undefined,
    //       datum: undefined,
    //       scriptRef: undefined
    //     }
    //   ]

    // Simple ADA payment working ---------------------------------------

//     const tx = await lucid.newTx()
//   .payToAddress("addr_test1qznl6ehymnju4m5lrykhstychgfcnpf0yymwn4yslzv96whv0dpa5rfnaxu5dtunn7a2ynkzgmp82v76kamfw5j478wqpkhv50", { lovelace: 500000n })
//   .complete();

// const signedTx = await tx.sign().complete();

// const txHash = await signedTx.submit();
// console.log(txHash);

// Multiple recipients --------------------------------------------------------

// Each payToAddress call creates new UTxO, also for same addresses.
// Lucid takes the order of outputs into account.

const tx = await lucid.newTx()
  .payToAddress("addr_testa...", { lovelace: 5000000n })
  .payToAddress("addr_testb...", { lovelace: 5000000n })
  .payToAddress("addr_testc...", { lovelace: 5000000n })
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();

}


// 1. main();
getBalance();