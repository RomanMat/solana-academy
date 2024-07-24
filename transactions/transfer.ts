import {
    Connection,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    PublicKey,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment, airdropIfRequired } from "@solana-developers/helpers";

const suppliedToPubkey = process.argv[2] || null;

if (!suppliedToPubkey) {
    console.log(`Please provide a public key to send to`);
    process.exit(1);
}

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

const toPubkey = new PublicKey(suppliedToPubkey);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

console.log(
    `✅ Loaded our own keypair, the destination public key, and connected to Solana`,
);

await airdropIfRequired(
    connection,
    toPubkey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL,
);

const transaction = new Transaction();

const LAMPORTS_TO_SEND = 10000;


const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey,
    lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const startTime = new Date();

const signature = await sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
]);

const endTime = new Date();
const transactionDuration = endTime.getTime() - startTime.getTime();

console.log(
    `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `,
);
console.log(`Transaction signature is ${signature}!`);
console.log(`Transaction took ${transactionDuration} milliseconds.`);
// Fee: 0.000005 SOL or ~0.00089 USD
// Transaction URL: https://explorer.solana.com/tx/24XoY9gLe31uokXXdPopcLPMNFAmFD2bZSo9T5FMtjjUvCNtwmfDhLbL3K6iTA7auJJSLLvNpquhsHE4b1vwzDga?cluster=devnet
// Transaction took less than 1 second to complete
// I think 'confirm' in Connection is a value that allows to specify the commitment level for the transaction.