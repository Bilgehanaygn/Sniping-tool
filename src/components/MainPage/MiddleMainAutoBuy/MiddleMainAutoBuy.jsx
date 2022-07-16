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
import axios from 'axios';

const ListElement = ({element, showTransaction}) => {
    return (
        <div style={{display:"flex", flexDirection:"row", width:"100%", marginBottom:"1vh", 
            borderRadius:"0.5vh", fontSize:"1.1em" }}>
            <img src={element.extra?.img} alt="img" style={{width:"5vw", height:"auto", marginRight:"1vw", borderRadius:"0.5vh"}} />
            <div style={{textAlign:"left"}} >
                <div>
                    {element.name} {element.title}
                </div>
                <div>
                    For: {element.price} ◎
                </div>
                {
                    showTransaction ? 
                    <div>
                        <a href={`https://explorer.solana.com/tx/${element.itemTransaction}`} 
                        style={{color:`${theme.primary}`}} >
                            {element.itemTransaction?.substring(0,5) + ".." + element.itemTransaction?.substring(83,88)}
                        </a>
                    </div>
                    :
                    ""
                }
            </div>
        </div>
    )
}



const MiddleMainAutoBuy = ({selectedCollection}) => {
    const [totalSniped, setTotalSniped] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [runningTime, setRunningTime] = useState(0);
    const runningTimeRef = useRef(runningTime);
    const [runningTimeInterval, setRunningTimeInterval] = useState(null);
    const [ready, setReady] = useState(false);
    const [started, setStarted] = useState(false);
    const startedRef = useRef(started);
    const [givenQuantity, setGivenQuantity] = useState(0);
    const [givenPrice, setGivenPrice] = useState(0);
    const [snipedItems, setSnipedItems] = useState([]);
    const snipedItemsRef = useRef(snipedItems);
    const [currentStateMessage, setCurrentStateMessage] = useState(0);
    const [detectedItem, setDetectedItem] = useState(null);
    
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
            let inputPrice = parseFloat(document.getElementById('price-input').value);
            console.log(inputPrice);
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
                    try{
                        if(snipedItemsRef.current.find(element=>element.tokenMint===item.tokenMint)){
                            return;
                        }
                        try{
                            let res = axios.get(`https://api.all.art/v1/solana/${item.tokenAddress}`);
                            if(typeof res?.data === 'undefined' || typeof res?.data?.Title === 'undefined'){
                                setDetectedItem({...item, title: "#" + "NaN"});
                                item = {...item, title: "#" + "NaN"}
                            }
                            else{
                                setDetectedItem({...item, title: "#" + responses[i]?.data?.Title.split("#")[1]});  
                                item = {...item, title: "#" + responses[i]?.data?.Title.split("#")[1]}                                      
                            }
                        }
                        catch(err){
                            console.log(err);
                        }
                        //execute buying processes
                        setCurrentStateMessage(2);
                        console.log("in");
                        let buyRes = await sendBuyInstruction(publicKey.toBase58(), item.seller, item.auctionHouse, item.tokenMint,
                        item.tokenAddress, item.price);
                        if(!startedRef.current){
                            return;
                        }
                        let txn = Transaction.from(buyRes.data.txSigned.data);
                        let txnSigned = await signTransaction(txn);
    
                        setTotalAttempts(totalAttempts+1);
    
                        const signature = await sendAndConfirmRawTransaction(connection, txnSigned.serialize(), 
                        {skipPreflight: true, preflightCommitment: 'processed', maxRetries: 3, commitment: 'processed'});
    
                        //if we see response everything succeeded, on error catch block is executed
                        console.log(signature);
                        dispatch({
                            type:types.SET_WALLET_BALANCE,
                            payload: (await connection.getBalance(publicKey))
                        })
                        setTotalSpent(totalSpent+item.price);
                        setTotalSniped(totalSniped+1);
                        setSnipedItems([...snipedItemsRef.current, {...item, itemTransaction:signature, name:state.selectedCollectionInfo.name}]);
                        snipedItemsRef.current = [...snipedItemsRef.current, item];
                        setCurrentStateMessage(1);
                        setDetectedItem(null);
                        //update balance
                        
                        //check if max quantitity reached
                        if(totalSniped >= givenQuantity){
                            setStarted(false);
                            startedRef.current = false;
                            dispatch({
                                type: types.AUTO_BUY_STATE,
                                payload: false
                            })
                        }
                    }
                    catch(error){
                        //if transaction failed
                        setDetectedItem(null);
                        setCurrentStateMessage(1);
                        snipedItemsRef.current = [...snipedItemsRef.current, item];
                    }
                    
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
            dispatch({
                type: types.AUTO_BUY_STATE,
                payload: true
            })
            setCurrentStateMessage(1);
            //start timer
            setRunningTimeInterval(setInterval(()=>{
                runningTimeRef.current = runningTimeRef.current+1;
                setRunningTime(runningTimeRef.current);
            } ,1000));
            while(startedRef.current){
                await startListening();
                await new Promise(resolve=>{setTimeout(()=>{resolve();},700)})
            }
        }
        else{
            console.log("else girildi");
            clearInterval(runningTimeInterval);
            setRunningTimeInterval(null);
            setRunningTime(0);
            runningTimeRef.current=0;
            startedRef.current = !started;
            setStarted(!started);
            setCurrentStateMessage(0);
            dispatch({
                type: types.AUTO_BUY_STATE,
                payload: false
            })
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
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between",}} >
                <div style={{width:"35vw", }} >
                    <div style={{display:"inline-block", width:"50%"}} >
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
                                <span style={{position:"absolute", right:"5%", color:`${theme.primary}`, bottom:"10%"}} >◎</span>
                            </div>

                        </div>
                        <div className="specification-wrapper" >
                            <div style={{marginBottom:"1vh"}} >
                                Max Rarity To Snipe
                            </div>
                            <div style={{position:"relative", opacity:(ready ? 0.5 : 1)}}>
                                <input id="price-input" className="specification-input" type="text" placeholder="Moonrank" disabled={ready} />
                                <span style={{position:"absolute", right:"5%", color:`${theme.primary}`, bottom:"10%"}} >⍜</span>
                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex", flexDirection:"column", alignItems:"center", marginTop:"5vh"}} >
                        <div style={{display:"flex", flexDirection:"row", marginBottom:"1vh", }} >
                            <div className="specification-wrapper" style={{marginRight:"1vw"}} >
                                <div>
                                    Wallet Balance
                                </div>
                                <div style={{textAlign:"center", color:`${theme.primary}`}} >
                                {(state.walletBalance/1000000000).toFixed(2)} ◎
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
                        <div style={{marginTop:"3vh", fontSize:"1.5em", width:"50%", padding:"0.5vh 0", position:"relative",
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
                    <div style={{marginRight:"1vw", width:"50%", display:"flex", flexDirection:"column",
                        justifyContent:"center"}} >
                        <div style={{display:"flex",justifyContent:"space-around", marginBottom:"2vh"}} >
                            <div className="specification-wrapper">
                                <span style={{fontSize:"1em"}} >
                                    Sniped:
                                </span>
                                <span style={{textAlign:"center", color:`${theme.primary}`, marginLeft:"1vw"}} >
                                    {totalSniped}
                                </span>
                            </div>
                            <div className="specification-wrapper">
                                <span style={{fontSize:"1em"}} >
                                    Spent:
                                </span>
                                <span style={{textAlign:"center", color:`${theme.primary}`, marginLeft:"1vw"}} >
                                    {totalSpent} ◎
                                </span>
                            </div>
                            
                        </div>
                        <div style={{borderRadius:"0.5vh", backgroundColor:"#282c34", height:"40%", display:"flex", 
                            justifyContent:"center", alignItems:"center"}} 
                            id={currentStateMessage === 0 ? "" : "item-detection-area"} >
                                {
                                    currentStateMessage===0 ? "Waiting for starting." :
                                    (currentStateMessage===1 ? "Looking for items to snipe." : null)                                    
                                }
                                {
                                    currentStateMessage===2 ? 
                                    <div>
                                        <div style={{marginBottom:"1vh"}} >Attempting to snipe.</div>
                                        <ListElement element={detectedItem} showTransaction={false} />
                                    </div>
                                    : null
                                }
                        </div>
                    </div>
                    <div style={{width:"50%",  backgroundColor:"#282c34"}} >
                        <div style={{fontSize:"1.6em", textAlign:"center", borderBottom:`2px solid ${theme.primary}`,
                        padding:"0.5vh",}}>
                            Sniped Items
                        </div>
                        <div style={{overflowY:"auto", height:"calc(100% - 5vh)", padding:"1vh",
                            display:"flex",flexDirection:"column",alignItems:"center"}} >
                            {
                                snipedItems.map((element,index)=>
                                    <ListElement element={element} showTransaction={true} key={index} />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MiddleMainAutoBuy;