import types from "../../../actions/types";
import { ContextValue } from "../../../context/Context";
import Loading from "../../Loading/Loading";
import CollectionDetailsHeader from "../MiddleMainCommons/CollectionDetailsHeader";
import { fetchCollectionDetails, fetchCollectionListings } from "../../../actions/collections";
import theme from "../../../theme/theme";
import './middlemainautobuy.css';
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useEffect, useRef} from "react";
import { sendBuyInstruction } from "../../../actions/instructions";
import { sendAndConfirmRawTransaction, Transaction } from "@solana/web3.js";

const MiddleMainAutoBuy = ({selectedCollection}) => {
    const [totalSniped, setTotalSniped] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);

    const [ready, setReady] = useState(false);
    const [started, setStarted] = useState(false);
    const startedRef = useRef(started);
    const [givenQuantity, setGivenQuantity] = useState(0);
    const [givenPrice, setGivenPrice] = useState(0);
    
    const {publicKey, signTransaction} = useWallet();
    const {connection} = useConnection();
    const [state, dispatch] = ContextValue();

    const handleRefreshClick = () => {
        initializePage();
    }

    const handleSwitch = () => {
        if(!ready){
            //check given inputs
            let inputQuantity = parseInt(document.getElementById('quantity-input').value);
            let inputPrice = parseInt(document.getElementById('price-input').value);
            if(isNaN(inputQuantity) || inputQuantity <= 0){
                alert('invalid quantity input');
                document.getElementById('switch').checked = false;
                return;
            }
            if(isNaN(inputPrice) || inputPrice <= 0){
                alert('invalid price input');
                document.getElementById('switch').checked = false;
                return;
            }
            setGivenQuantity(inputQuantity);
            setGivenPrice(inputPrice);
    
        }
        else{
            //nothing
        }
        setReady(!ready);
    }

    const startListening = async() => {
        try{
            let res = await fetchCollectionListings(state.selectedCollectionInfo?.symbol, 0, 5);
            let floorFive = res.data;
            //if item is lower than selected price
            for(let item of floorFive){
                if(item?.price <= givenPrice){
                    //clear interval
                    clearInterval(listener);
                    setListener(null);

                    //execute buying processes
                    console.log("in");
                    let buyRes = await sendBuyInstruction(publicKey.toBase58(), item.seller, item.auctionHouse, item.tokenMint,
                    item.tokenAddress, item.price);
                    let txn = Transaction.from(buyRes.data.txSigned.data);
                    let txnSigned = await signTransaction(txn);
                    const response = await sendAndConfirmRawTransaction(connection, txnSigned.serialize(), 
                    {skipPreflight: true, preflightCommitment: 'processed', maxRetries: 3, commitment: 'processed'});

                    //if we see response everything succeeded, on error catch block is executed
                    console.log(response);
                    //send buy instruction
                    //sign and send transaction
                    //wait for response
                    //if response is succeess
                    //check if maxQuantity exceed
                    //ifnot  go
                    //ifso return
                }
            }
        }
        catch(err){
            console.log(err);
        }
    }

    const handleStartClick = async () => {
        if(!ready){
            return;
        }
        if(!started){
            startedRef.current = !started;
            setStarted(!started);
            while(startedRef.current){
                let res = await new Promise(resolve=>{setTimeout(()=>{console.log("looped");resolve(5)},5000)})
            }
        }
        else{
            console.log("else girildi");
            startedRef.current = !started;
            setStarted(!started);
        }

        
        
    }

    const initializePage = async () => {
        let collectionDetailsRes = await fetchCollectionDetails(selectedCollection.symbol);
        let balance = await connection.getBalance(publicKey);        

        dispatch({
            type: types.SET_WALLET_BALANCE,
            payload: balance
        })

        dispatch({
            type: types.FETCH_SELECTED_COLLECTION_INFO,
            payload: {...selectedCollection, ...collectionDetailsRes.data}
        })

        dispatch({
            type: types.CURRENT_COLLECTION_LOADING_DONE,
            payload: true
        })
    }
    
    useEffect(() => {
        initializePage();
    }, [])
    

    return (
        !state.currentCollectionLoadingDone ? <Loading callBackFunction={null} callCallBack={false} /> :
        <div style={{padding:"0vh 2vh", overflowY:"auto", maxHeight:"92vh", height:"92vh"}}>
            <CollectionDetailsHeader handleRefreshClick={handleRefreshClick} />
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}} >
                <div style={{width:"35vw", }} >
                    <div style={{display:"inline-block"}} >
                        <div className="specification-wrapper" >
                            <div style={{marginBottom:"1vh"}} >
                                Max items to snipe
                            </div>
                            <div style={{opacity:(ready ? 0.5 : 1)}} >
                                <input id="quantity-input" className="specification-input" type="text" placeholder="Quantity" disabled={ready} />
                            </div>
                        </div>
                        <div className="specification-wrapper">
                            <div style={{marginBottom:"1vh"}} >
                                Max price to snipe
                            </div>
                            <div style={{position:"relative", opacity:(ready ? 0.5 : 1)}} >
                                <input id="price-input" className="specification-input" type="text" placeholder="Price" disabled={ready} />
                                <span style={{position:"absolute", right:"5%", color:`${theme.primary}`}} >◎</span>
                            </div>

                        </div>
                        <div className="specification-wrapper" >
                            <div style={{marginBottom:"1vh"}} >
                                Max Rarity
                            </div>
                            <div style={{position:"relative", opacity:(ready ? 0.5 : 1)}}>
                                <input id="price-input" className="specification-input" type="text" placeholder="Moonrank" disabled={ready} />
                                <span style={{position:"absolute", right:"5%", color:`${theme.primary}`}} >⍜</span>
                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex", flexDirection:"column", alignItems:"center", marginTop:"5vh"}} >
                        <div style={{display:"flex", flexDirection:"row", marginBottom:"1vh"}} >
                            <div className="specification-wrapper" style={{marginRight:"1vw"}} >
                                <div>
                                    Wallet Balance
                                </div>
                                <div style={{textAlign:"center", color:`${theme.primary}`}} >
                                {(state.walletBalance/1000000000).toFixed(2)} ◎
                                </div>
                            </div>
                            <div className="specification-wrapper" >
                                <div>
                                    Running Time
                                </div>
                                <div style={{textAlign:"center", color:`${theme.primary}`}} >
                                    00:00:00
                                </div>
                            </div>
                        </div>
                        <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", fontSize:"1.5em"}}>
                            <label style={{marginRight:"1vw"}} >
                                Ready
                            </label>
                            <input type="checkbox" id="switch" onChange={handleSwitch} disabled={started} />
                            <label htmlFor="switch" className="custom-switch"></label>
                        </div>
                        <div style={{marginTop:"3vh", fontSize:"1.5em", width:"65%", padding:"0.5vh 0", position:"relative",
                            backgroundColor: `${theme.primary}`,borderRadius:"1vh", fontWeight:600, cursor: (ready ? "pointer" : "not-allowed")}} 
                            onClick={handleStartClick} >
                                {
                                    ready ? null : 
                                    <div style={{position:"absolute", width:"100%", height:"100%", top:0, left:0, background:"black", opacity:0.5,
                                    borderRadius:"1vh"}} ></div>
                                }
                            {!started ? "Start" : "Stop"}
                        </div>
                    </div>
                </div>
                <div style={{width:"40vw", borderRadius:"0.5vh", display:"flex",flexDirection:"row"}}>
                    <div style={{marginRight:"1vw", width:"50%"}} >
                        <div style={{height:"60%", display:"inline-block"}} >
                            <div className="specification-wrapper">
                                <div style={{textAlign:"center", marginBottom:"9.6px"}} >
                                    Total Attempts
                                </div>
                                <div style={{textAlign:"center", color:`${theme.primary}`}} >
                                    {totalAttempts}
                                </div>
                            </div>
                            <div className="specification-wrapper">
                                <div style={{textAlign:"center", marginBottom:"9.6px"}} >
                                    Total Snipes
                                </div>
                                <div style={{textAlign:"center", color:`${theme.primary}`}} >
                                    {totalSniped}
                                </div>
                            </div>
                            <div className="specification-wrapper">
                                <div style={{textAlign:"center", marginBottom:"9.6px"}} >
                                    Total Spent
                                </div>
                                <div style={{textAlign:"center", color:`${theme.primary}`}} >
                                    {totalSpent} ◎
                                </div>
                            </div>
                            
                        </div>
                        <div style={{borderRadius:"0.5vh", backgroundColor:"#282c34", height:"40%", display:"flex", 
                            justifyContent:"center", alignItems:"center"}} >
                                Found item
                        </div>
                    </div>
                    <div style={{width:"50%",  backgroundColor:"#282c34"}} >
                        <div style={{fontSize:"1.6em", textAlign:"center",}}>
                            Sniped Items
                        </div>
                        <div>
                            Items as a list
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MiddleMainAutoBuy;