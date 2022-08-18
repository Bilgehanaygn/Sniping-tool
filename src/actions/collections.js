import axios from 'axios';

// const url = 'https://solshot-server.herokuapp.com';

// export const fetchAllCollections = () => {
//     return axios.get(url + '/fetchAllCollections');
// }

// export const fetchCollectionDetails = () => {}
// export const fetchCollectionListings = () => {}
// export const fetchItemDetails = () => {}


export const fetchAllCollections = () => {

    let requests = [];
    for(let i=0;i<21;i++){
        requests.push(axios.get(`https://api-mainnet.magiceden.dev/v2/collections?offset=${i*500}&limit=500`));
    }

    return axios.all(requests);

}


export const fetchCollectionDetails = (symbol) => {
    
    return axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${symbol}/stats`);

}


export const fetchCollectionListings = (symbol, offset, limit=20) => {

    return axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${symbol}/listings?offset=${offset*20}&limit=${limit}&sort=price`);

}


export const fetchItemDetails = (tokenAddressList) => {

    let requests = [];
    for (let i of tokenAddressList){
        requests.push(axios.get(`https://api.all.art/v1/solana/${i}`));
    }

    return axios.all(requests);

}


export const popularCollections = [
    {name: "DeGods", symbol:"degods", image:"https://i.imgur.com/fO3tI1t.png"},
    {name: "Okay Bears", symbol:"okay_bears", image:"https://bafkreidgfsdjx4nt4vctch73hcchb3pkiwic2onfw5yr4756adchogk5de.ipfs.dweb.link"},
    {name: "Primates", symbol:"primates", image:"https://bafybeifnx4apyushfc3i2tg5wx2xgudcfxgisd2sven2mhxixpghuo2jeu.ipfs.dweb.link/"},
    {name: "DegenTown", symbol:"degentown", image:"https://dl.airtable.com/.attachmentThumbnails/408f2a34f3ee1f67856cca3a226d71ab/9679778e"},
    {name: "Bubblegoose Ballers", symbol:"bubblegoose_ballers", image:"https://dl.airtable.com/.attachmentThumbnails/91673f0315b610cc0d1db91d23ff329a/686f5df0"},
    {name: "Udder Chaos", symbol:"udder_chaos", image:"https://creator-hub-prod.s3.us-east-2.amazonaws.com/udder_chaos_pfp_1655229269923.gif"},
    {name: "Gothic Degends", symbol:"gothic_degens", image:"https://creator-hub-prod.s3.us-east-2.amazonaws.com/gothic_degens_pfp_1654733979006.png"},
    {name: "Netrunner", symbol:"netrunner", image:"https://bafybeidm5eagsdbikbqokdtcmm5b2jjqetcjxg7b3bsdyxft6rgdalm2nu.ipfs.dweb.link/"},
    {name: "Blocksmith Labs", symbol:"blocksmith_labs", image:"https://dl.airtable.com/.attachmentThumbnails/b1aabaad68ef1a7512de6a0ddd15f38d/47c53a89"},
    {name: "Quantum Traders", symbol:"quantum_traders", image:"https://dl.airtable.com/.attachments/c1bbf7661f0d40935bf8dfbe50b340cc/e0cad0b5/ItzsH50B_400x400.jpeg"},
    {name: "Cets On Creck", symbol:"cets_on_creck", image:"https://creator-hub-prod.s3.us-east-2.amazonaws.com/cats_on_crack_pfp_1644850873089.png"},
    {name: "Reptilian Reneage", symbol:"lizards", image:"https://bafybeiaodvhrw4xb36l2ja2a377anqd2ykqznzspb5rqdtokaocozona6y.ipfs.dweb.link/"},
    {name: "Trippin Ape Tribe", symbol:"trippin_ape_tribe", image:"https://i.imgur.com/iFgvQva.png"},
    {name: "Aurory", symbol:"aurory", image:"https://arweave.net/XnmNKTJOthZ1PcqSspYLPTjFHGJRCe-lGrapzNM0VVQ"},
    {name: "Degenerate Ape Academy", symbol:"degenerate_ape_academy", image:"https://bafkreie44hlb5xve225n6p2siebaevxiwha37aefyvs2ul2kx2akalnree.ipfs.dweb.link/"},
    {name: "Communi3: Mad Scientists", symbol:"communi3", image:"https://bafybeifpz2j5oy4e7u2c5vrgnp4grts5sbpjsz2piylgngrmo7wk5xmxw4.ipfs.dweb.link/"},
    {name: "Famous Fox Federation", symbol:"famous_fox_federation", image:"https://bafybeiglipep6klutky4atw7jhf7lknpgzbfqlmqmamqh5s6lwih6uopma.ipfs.dweb.link/"},
    {name: "Delysid Kiddos", symbol:"delysid_kiddos", image:"https://bafkreif6pptlerakqwgvjpwebgqe5crzcddxhkziwfu4yelpijuajfkbl4.ipfs.dweb.link/"},
    {name: "Catalina Whale Mixer", symbol:"the_catalina_whale_mixer", image:"https://bafkreicadecx3rbffm6tqtgtc67bi6r2xiibtmawcejje7pfu7id2zxwwy.ipfs.dweb.link/"},
    {name: "Just Ape", symbol:"justape", image:"https://bafybeicwsd4if6yxgunl4x4czy3kp2i7fzwppvbkaj4l3touqhjw4z2wfa.ipfs.dweb.link/"},
];
