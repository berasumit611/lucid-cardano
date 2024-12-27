import { Blockfrost, Lucid } from "https://deno.land/x/lucid/mod.ts";

const lucid = await Lucid.new(
  new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", "<projectId>"),
  "Preprod",
);


const privateKey = lucid.utils.generatePrivateKey(); // Bech32 encoded private key
console.log(privateKey);
// Now we select a private key wallet with our Lucid instance:

lucid.selectWalletFromPrivateKey(privateKey);

// Build your first transaction
// Let's create a simple transaction where we send 5 ADA to two recipients each:
const tx = await lucid.newTx()
  .payToAddress("addr_testa...", { lovelace: 5000000n })
  .payToAddress("addr_testb...", { lovelace: 5000000n })
  .complete();

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

console.log(txHash);

// Choose a wallet
// Use different methods to select a wallet and query balances.
const privateKey = lucid.utils.generatePrivateKey(); // Bech32 encoded private key
lucid.selectWalletFromPrivateKey(privateKey);

// Select wallet from seed phrase
const seed = lucid.utils.generateSeedPhrase();
lucid.selectWalletFromSeed(seed);

//Select wallet from browser
const api = await window.cardano.nami.enable();
lucid.selectWallet(api);

// Query wallet
// Get address

const address = await lucid.wallet.address(); // Bech32 address
// Query UTxOs
const utxos = await lucid.wallet.getUtxos();
// Query delegation
const delegation = await lucid.wallet.getDelegation();

// Choose a provider
// Blockfrost
import { Blockfrost, Lucid } from "https://deno.land/x/lucid/mod.ts";

const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    "<project_id>",
  ),
  "Preprod",
);
// Maestro
import { Lucid, Maestro } from "https://deno.land/x/lucid/mod.ts";

const lucid = await Lucid.new(
  new Maestro({
    network: "Preprod",  // For MAINNET: "Mainnet".
    apiKey: "<Your-API-Key>",  // Get yours by visiting https://docs.gomaestro.org/docs/Getting-started/Sign-up-login.
    turboSubmit: false  // Read about paid turbo transaction submission feature at https://docs.gomaestro.org/docs/Dapp%20Platform/Turbo%20Transaction.
  }),
  "Preprod", // For MAINNET: "Mainnet".
);

// Query provider
// Query UTxOs
const utxos = await lucid.provider.getUtxos("addr_test...");
// Query datums
const datum = await lucid.provider.getDatum("<datum_hash>");
// For convenience you can also query datums directly 
// from utxos. When you query the datum for a UTxO, 
// Lucid automatically adds the datum to the UTxO. 
// This means that subsequent queries for the same 
// UTxO will return the result instantly, without the 
// need for an additional network request.
const [scriptUtxo] = await lucid.utxosAt("addr_test...");
const datum = await lucid.datumOf(scriptUtxo);

// Query protocol parameters
const protocolParameters = await lucid.provider.getProtocolParameters();


// Make payments
// Send ADA and native tokens.

// Simple ADA payment
// Multiple recipients
// Send native tokens
// Send ADA with metadata
// Send ADA with datum

// 1 
const tx = await lucid.newTx()
  .payToAddress("addr_test...", { lovelace: 5000000n })
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();
// 2
const tx = await lucid.newTx()
  .payToAddress("addr_testa...", { lovelace: 5000000n })
  .payToAddress("addr_testb...", { lovelace: 5000000n })
  .payToAddress("addr_testc...", { lovelace: 5000000n })
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();
// 3
const policyId = "00...";
const assetName = "MyToken";

const tx = await lucid.newTx()
  .payToAddress("addr_test...", { [policyId + fromText(assetName)]: 10n })
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();
// 4
const tx = await lucid.newTx()
  .payToAddress("addr_test...", { lovelace: 5000000n })
  .attachMetadata(1, { msg: "Hello from Lucid." })
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();
// 5
const tx = await lucid.newTx()
  .payToAddressWithData("addr_test...", Data.to("31313131"), {
    lovelace: 5000000n,
  })
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();

// Register/deregister a stake key and delegate to a stake pool.

// Register stake key
// Delegate to a stake pool
// Withdraw rewards
// Deregister stake key

// Register stake key
// 2 ADA will be taken as pledge for the registration of the stake key.

// 1
const rewardAddress = await lucid.wallet.rewardAddress();

const tx = await lucid.newTx()
  .registerStake(rewardAddress)
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();
// 2
const rewardAddress = await lucid.wallet.rewardAddress();

const tx = await lucid.newTx()
  .delegateTo(rewardAddress, "poolabc...")
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();
// 3
const rewardAddress = await lucid.wallet.rewardAddress();

const delegation = await lucid.wallet.getDelegation();

const tx = await lucid.newTx()
  .withdraw(rewardAddress, delegation.rewards)
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();
// 4
// Deregister stake key
// Reclaim the 2 ADA used for the registration of the stake key.


const rewardAddress = await lucid.wallet.rewardAddress();

const tx = await lucid.newTx()
  .deregisterStake(rewardAddress)
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();

// Create a stake pool
// Register and retire a stake pool.

// 1.Register stake pool

// Cold key and vrf key were imported from the cardano-cli. The cold key is necessary to add a required witness to the transaction and the vrf key needs to be added to the pool parameters.
/** StakePoolSigningKey_ed25519 cborHex from the cardano-cli */
const coldKey = C.PrivateKey.from_bytes(
    fromHex(
      "58204de30f983ed860524d00059c7f2b1d63240fba805bee043604aa7ccb13d387e9",
    ),
  );
  
  /** VrfVerificationKey_PraosVRF cborHex from the cardano-cli */
  const vrfKeyHash = C.VRFVKey.from_bytes(
    fromHex(
      "5820c9cf07d863c8a2351662c9759ca1d9858b536bab50ad575b5de161e1af18f887",
    ),
  ).hash().to_hex();
  
  const poolId = coldKey.to_public().hash().to_bech32("pool");
  
  const rewardOwnerAddress = await lucid.wallet.rewardAddress();
  
  const poolParams = {
    poolId,
    vrfKeyHash,
    pledge: 100000000n,
    cost: 340000000n,
    margin: 0.025, // 2.5%
    rewardAddress: rewardOwnerAddress,
    owners: [rewardOwnerAddress],
    relays: [{ type: "SingleHostIp", ipV4: "123.456.789.0", port: 3000 }],
    metadataUrl: "https://...", // metadata needs to be hosted already before registering the pool
  };
  
  const tx = await lucid.newTx()
    .registerPool(poolParams).complete();
  
  const signedTx = await tx.sign()
    .signWithPrivateKey(coldKey.to_bech32())
    .complete();
  
  const txHash = await signedTx.submit();
// 2.Retire stake pool
const retirementEpoch = 100;

const tx = await lucid.newTx()
  .retirePool(poolId, retirementEpoch)
  .complete();

const signedTx = await tx.sign()
  .signWithPrivateKey(coldKey.to_bech32())
  .complete();

const txHash = await signedTx.submit();

// MINT AND BURN NATIV TOKENS ASSETS

// Mint
// First we need to create a minting policy for the assets we want to mint. In this example we utilize a native script time-locking policy with our wallet as required signer:

const { paymentCredential } = lucid.utils.getAddressDetails(
    await lucid.wallet.address(),
  );
  
  const mintingPolicy = lucid.utils.nativeScriptFromJson(
    {
      type: "all",
      scripts: [
        { type: "sig", keyHash: paymentCredential.hash },
        {
          type: "before",
          slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000),
        },
      ],
    },
  );

//   Next we derive the policy id from the minting policy script:
const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);
// Now we can mint our desired tokens:
const unit = policyId + fromText("MyMintedToken");

const tx = await lucid.newTx()
  .mintAssets({ [unit]: 1n })
  .validTo(Date.now() + 200000)
  .attachMintingPolicy(mintingPolicy)
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();
// Burn
const unit = policyId + fromText("MyMintedToken");

const tx = await lucid
  .newTx()
  .mintAssets({ [unit]: -1n })
  .validTo(Date.now() + 200000)
  .attachMintingPolicy(mintingPolicy)
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();

// INTERACT WITH SMART CONTRACT

// Build and submit transactions that include plutus validators.

// Matching numbers example
// Create and instantiate validator
// Lock funds at plutus script
// Redeem from plutus script
// Apply parameters
// Plutus script purposes
// Multi validator interactions
// Read UTxOs and plutus scripts

// It's important to note that on the Cardano blockchain, 
// you don't directly interact with smart contracts. Rather, 
// you work with validators. These validators are responsible for 
// verifying the actions taken in a given transaction, rather than 
// executing or calling any actions themselves. In other words, a 
// validator checks whether the transaction meets its requirements, 
/// and if it does, the transaction is processed successfully. 
// Conversely, if the requirements are not met, the transaction fails.

// You need to have a wallet and a provider selected in order to build and submit transactions.
// Matching numbers example
// We demonstrate the idea 
// of plutus validators in 
// Lucid based on a validator 
// that requires the number 
// in the datum to match the 
// number in the redeemer.
const matchingNumberScript = {
  type: "PlutusV2",
  script: "59099a590997010000...",
};

const matchingNumberAddress = lucid.utils.validatorToAddress(
  matchingNumberScript,
);

// Lock funds at plutus script
const tx = await lucid
  .newTx()
  .payToContract(matchingNumberAddress, { inline: Data.to(100n) }, {
    lovelace: 20000000n,
  })
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();

// Redeem from plutus script
const [scriptUtxo] = await lucid.utxosAt(matchingNumberAddress);

const tx = await lucid
  .newTx()
  .collectFrom([scriptUtxo], Data.to(100n))
  .attachSpendingValidator(matchingNumberScript)
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();

// Apply parameters
// Some validators are parameterized. Lucid allows you to apply parameters dynamically:
const mintingPolicy = {
  type: "PlutusV2",
  script: applyParamsToScript(
    "5907945907910100...",
    [10n],
  ),
};
// Plutus script purposes
// Like native scripts, plutus scripts 
// can not only be used for checking the 
// spending conditions of UTxOs, but also for 
// verifying conditions related to minting, 
// delegations and withdrawals.

// In Lucid the following specified 
// transaction constraints take as last parameter 
// the redeemer. The redeemer is necessary to 
// execute the script successfully. When leaving 
// out the redeemer Lucid assumes you utilize 
// puplic keys or native scripts.
.collectFrom(utxos, redeemer)

.mintAssets(assets, redeemer)

.delegateTo(stakeAddress, poolId, redeemer)

.deregisterStake(stakeAddress, redeemer)

.withdraw(stakeAddress, rewardAmount, redeemer)
// Multi validator interactions
// You can run and execute multiple validators 
// in a single transaction with Lucid. 
// The only limitation you have is the execution units limit:
const tx = await lucid
  .newTx()
  .collectFrom([scriptUtxoA, scriptUtxoB], Data.void())
  .collectFrom([scriptUtxoC], Data.void())
  .collectFrom([scriptUtxoD], Data.void())
  .mintAssets([plutusPolicyId]: 10n, Data.void())
  .attachSpendingValidator(spendingScript1)
  .attachSpendingValidator(spendingScript2)
  .attachMintingPolicy(mintingPolicy)
  .complete();
// Read UTxOs and plutus scripts
// Lucid allows you to conveniently read/reference UTxOs. If a plutus script is already stored in the UTxO, there is no need to attach the same script explicitly in the transaction, resulting in cost savings.
const tx = await lucid
  .newTx()
  .readFrom([scriptUtxo])
  .complete();