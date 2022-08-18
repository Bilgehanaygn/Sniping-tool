import axios from "axios";

// const url = 'https://solshot-server.herokuapp.com';

// export const getMintTransactionFromME = (payloadObj) => {
//     return axios.post(url + '/mintTransaction', payloadObj);
// }

// export const getMintDetailsFromME = (mintUrl) => {
//     console.log(mintUrl);
//     return axios.get(url + `/launchpadSelection?mintUrl=${mintUrl}`);
// }


export const getMintTransactionFromME = (payloadObj) => {
    return axios.post('https://wk-notary-prod.magiceden.io/mintix',payloadObj);
}

export const getMintDetailsFromME = (mintUrl) => {
    return axios.get("https://api-mainnet.magiceden.io/launchpads/" + mintUrl);
}