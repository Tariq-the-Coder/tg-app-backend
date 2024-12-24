// const fetch = require("node-fetch");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.verifyTONTransaction = async (msg_hash) => {
  try {
    const response = await fetch(
      `https://testnet.toncenter.com/api/v3/transactionsByMessage?msg_hash=${encodeURIComponent(msg_hash)}`
    );
    const data = await response.json();

    return data.transactions && data.transactions.length > 0;
  } catch (error) {
    console.error("Error verifying TON transaction:", error.message);
    return false;
  }
};
