import { Transaction, Keypair } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import axios from "axios";
import theme from "../../../../theme/theme";
import './mintdetails.css';
import { useState, useRef, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { ContextValue } from "../../../../context/Context";
import types from "../../../../actions/types";
import { utils } from "@project-serum/anchor";

const MintDetails = ({selectionCallBack, collectionDetails, requestDetails}) => {
    //if type magic eden
    const [started, setStarted] = useState(false);
    const startedRef = useRef(started);
    const [state,dispatch] = ContextValue();
    const [countDown, setCountDown] = useState("initial");
    const [errorCount, setErrorCount] = useState(0);
    const errorCountRef = useRef(errorCount);
    const {publicKey, signTransaction} = useWallet();
    const {connection} = useConnection();

    const startDate = new Date(collectionDetails.publicStartTime);
    const endDate = new Date(collectionDetails.publicEndTime);

    const beautifiedStartDate = startDate.getDate() + " " + startDate.toString().split(" ")[1] + " " + startDate.getFullYear() + 
    " " + startDate.toString().split(" ")[4];
    const beautifiedEndDate = endDate.getDate() + " " + endDate.toString().split(" ")[1] + " " + endDate.getFullYear() + 
    " " + endDate.toString().split(" ")[4];

    const handleBackClick = () => {
        if(state.autoBuyRunning){
            return;
        }
        selectionCallBack();
    }

    useEffect(
        ()=>{
                if(startDate.getTime()-new Date().getTime() <= 0){
                    console.log("case");
                    setCountDown("Live!");
                    return;
                }
                const countDownInterval = setInterval(()=>{
                    let remainingTimeToStart = startDate.getTime()-new Date().getTime();
        
                    if(remainingTimeToStart <= 0){
                        setCountDown("Live!");
                        clearInterval(countDownInterval);
                    }
        
                    let hours = Math.floor((remainingTimeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    let minutes = Math.floor((remainingTimeToStart % (1000 * 60 * 60)) / (1000 * 60));
                    let seconds = Math.floor((remainingTimeToStart % (1000 * 60)) / 1000);
                    console.log("interval is working");
                    setCountDown(hours+":"+minutes+":"+seconds);
                },1000)
            }
    );

    const showOneMessage = async (message) => {
        var messageDom = document.getElementById("message-box");
        var el = document.createElement('div');

        el.innerHTML = message;
        el.className="show";
        messageDom.appendChild(el);
        setTimeout(() => {
            messageDom.removeChild(el);
          }, 1500);
    }

    const attemptToMint = async () => {
        let dateNow = new Date().getTime();
        if(collectionDetails.publicStartTime-dateNow >= 0 || collectionDetails.publicEndTime-dateNow <= 0){
            alert('Public mint is not started or ended.');
            handleStopClick();
            return;
        }
        console.log("in 1");
        const mintKey = Keypair.generate();
        console.log("in 2");
        const tokenAta = await getAssociatedTokenAddress(mintKey.publicKey, publicKey);
        const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        console.log("in 3");

        requestDetails.accounts.mint = mintKey.publicKey.toBase58();
        requestDetails.accounts.tokenAta = tokenAta;
        requestDetails.params.blockhash = recentBlockhash;
        
        // const headers = {
        //     "accept": "application/json, text/plain, */*",
        //     "accept-encoding": "gzip, deflate, br",
        //     "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        //     "content-length": 1411,
        //     "content-type": "application/json",
        //     "origin": "https://magiceden.io",
        //     "referer": "https://magiceden.io/",
        //     "sec-ch-ua": '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
        //     "sec-ch-ua-mobile": "?0",
        //     "sec-ch-ua-platform": "Windows",
        //     "sec-fetch-dest": "empty",
        //     "sec-fetch-mode": "cors",
        //     "sec-fetch-site": "cross-site",
        //     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        // }

        try{
            let res = await axios.post('https://wk-notary-prod.magiceden.io/mintix', requestDetails);
            
            console.log(res.data);

            let txn = Transaction.from(utils.bytes.bs58.decode(res.data.tx));
            let txnSigned = await signTransaction(txn);
            txnSigned.partialSign(mintKey);

            console.log(txnSigned);

            connection.sendRawTransaction(txnSigned.serialize(), {skipPreflight: !0});
            
            showOneMessage("Mint transaction sent. No further details will be provided.");
            setErrorCount(0);
            errorCountRef.current=0;
            await new Promise(resolve=>{setTimeout(()=>{resolve();},600)});
            //No further details will be provided!
        }
        catch(err){
            showOneMessage("Unknown error.");
            if(errorCountRef.current>=3){
                //process stopped after too many errors
                setStarted(false);
                startedRef.current=false;
                setErrorCount(0);
                errorCountRef.current=0;
                dispatch({
                    type: types.AUTO_BUY_STATE,
                    payload:false
                })
                showOneMessage("Process Stopped after too many errors. Make sure mint is not over.");
            }
            else{
                setErrorCount(errorCount+1);
                errorCountRef.current=errorCountRef.current+1;
            }
            await new Promise(resolve=>{setTimeout(()=>{resolve();},600)});
            console.log(err);
        }
    }

    const handleStartClick = async () => {
        try{
            setStarted(true);
            startedRef.current = true;

            dispatch({
                type: types.AUTO_BUY_STATE,
                payload: true
            })
            
            while(startedRef.current){
                await attemptToMint();
            }
        }
        catch(error){
            //request error do sth else
            //other types of error stop
        }
    }


    const handleStopClick = () => {
        setStarted(false);
        startedRef.current = false;
        dispatch({
            type: types.AUTO_BUY_STATE,
            payload: false
        })
    }

    const styles= {
        collectionAvatar: {
            width: "10vh",
            height: "10vh",
            borderRadius: "10vh",
            border: `4px solid ${theme.primary}`,
            margin: "0vw 1.5vw"
        },
        socialIcon: {
            color:theme.primary,
            marginLeft:"2vh",
            height:"4vh",
            width:"4vh",
        },
        detailsItem: {
            display:"flex",
            flexDirection:"row",
            justifyContent:"space-between",
            textAlign:"center",
            padding:"1vh",
        },
        startButtonSpecific: {
            backgroundColor: theme.primary,
            opacity: started ? 0.5 : 1,
            cursor: started ? "default" : "pointer"
        },
        stopButtonSpecific: {
            backgroundColor: "#000",
            opacity: started ? 1 : 0.3,
            cursor: started ? "pointer" : "default"
        }
        
    }
    
    return (
        <div style={{}} >
            <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", 
                borderBottom:`2px solid ${theme.primary}`, paddingBottom:"2vh"}} >
                <div style={{display:"flex", flexDirection:"row", alignItems:"center"}} >
                    <svg onClick={handleBackClick} style={state.autoBuyRunning ? {cursor:"not-allowed"} : {}} id="back-arrow" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-bar-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
                    </svg>
                    <img src={collectionDetails.image} style={styles.collectionAvatar} />
                    <div style={{maxWidth:"40vw", marginRight:"1vw", }} >
                        <div style={{fontSize:"1.6em", marginBottom:"0.5vh", overflow:"hidden", textAlign:"left"}} >
                            {collectionDetails?.name ? collectionDetails.name?.substring(0,36) : "ME Error"
                            }
                        </div>
                        <div style={{textAlign:"left", overflow:"hidden", maxHeight:"10vh"}} >
                            {collectionDetails?.description?.substring(0,100)}..
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"row", background:"#282c34", borderRadius:"0.5vh", padding:"3px", margin:"0vw 1vw"}} >
                    <a href={collectionDetails?.website} style={{...styles.socialIcon, marginLeft:0}} target="_blank" ><svg stroke="currentColor" fill="currentColor" viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg"><path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg></a>
                    <a href={collectionDetails?.twitter} style={styles.socialIcon} target="_blank" ><svg stroke="currentColor" fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg></a>
                    <a href={collectionDetails?.discord} style={{...styles.socialIcon,width:"4.7vh"}} target="_blank" ><svg stroke="currentColor" fill="currentColor" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"></path></svg></a>
                </div>
            </div>

            <div style={{width:"100%", marginTop:"5vh"}} >
                <div style={{width:"60vw", maxWidth:600, fontWeight:600, marginLeft: "auto", marginRight: "auto",}} >
                    <div style={{textAlign:"center", fontSize:"1.5em", marginBottom:"2vh", color:`${theme.primary}`}} > Details </div>
                    <div>
                        <div style={styles.detailsItem} >
                            <span>Supply:</span>
                            <span>{collectionDetails?.supply}</span>
                        </div>
                        <div style={styles.detailsItem} >
                            <span>Remaining:</span>
                            <span>{collectionDetails?.remaining}</span>
                        </div>
                        <hr/>
                        <div style={styles.detailsItem} >
                            <span>Public Price:</span>
                            <span>{collectionDetails?.publicMintPrice} ◎</span>
                        </div>
                        <div style={styles.detailsItem} >
                            <span>Public Start Time(Local):</span>
                            <span>{beautifiedStartDate}</span>
                        </div>
                        <div style={styles.detailsItem} >
                            <span>Public End Time(Local):</span>
                            <span>{beautifiedEndDate}</span>
                        </div>
                        <div style={styles.detailsItem} >
                            <span>Countdown to Start:</span>
                            <span> {countDown} </span>
                        </div>
                        <hr/>
                        <div style={{fontSize:"0.8em", fontWeight:200, textAlign:"right", margin:"1vh",}} >
                            <svg style={{width:"1em", height:"1em", marginRight:"0.3vw"}} xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                            </svg>
                            Only matters if auto-approve is turned on. Default and recommended value is 0.7s.
                        </div>
                        <div style={{fontSize:"0.8em", fontWeight:200, textAlign:"right", margin:"1vh",}} >
                            <svg style={{width:"1em", height:"1em", marginRight:"0.3vw"}} xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                            </svg>
                            Auto-approve is recommended to increase the mint chance.
                        </div>
                        <div style={styles.detailsItem} >
                            <span>Click Interval(seconds):</span>
                            <span>0.7s</span>
                        </div>
                        <div style={{...styles.detailsItem, marginTop:"2vh"}} >
                            <button className="start-stop-button" style={styles.startButtonSpecific} 
                                onClick={started ? null : handleStartClick} >Start</button>
                            <button className="start-stop-button" style={styles.stopButtonSpecific} 
                                onClick={started ? handleStopClick : null} >Stop</button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{position:"fixed", left:"2vw", top:"4vh"}} id="message-box"></div>
        </div>
    )
}



export default MintDetails;