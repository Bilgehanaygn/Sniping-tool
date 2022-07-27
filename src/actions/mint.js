import axios from "axios";

export const getMintTransactionFromME = (payloadObj) => {
    return axios.post('https://wk-notary-prod.magiceden.io/mintix',payloadObj);
}

export const getMintDetailsFromME = (mintUrl) => {
    return axios.get("https://api-mainnet.magiceden.io/launchpads/" + mintUrl);
}