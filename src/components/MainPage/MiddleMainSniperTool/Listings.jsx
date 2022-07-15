import { ContextValue } from "../../../context/Context";
import theme from "../../../theme/theme";
import types from "../../../actions/types";
import snipingIcon from '../../../assets/sniping-icon-black.webp';
import './listings.css';
import { sendBuyInstruction } from '../../../actions/instructions';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, sendAndConfirmRawTransaction, Transaction } from "@solana/web3.js";


const ListItem = ({itemDetails, index, checkInBasket, snipeItem, getItemState}) => {
    const [state, dispatch] = ContextValue();

    
    const handleItemClick = (stateType) => {
        if (state.basket.some(e => e.tokenAddress === itemDetails.tokenAddress)) {
            return;
        }
        dispatch({
            type: types.ADD_BASKET,
            payload: {...itemDetails, itemState: stateType}
        });
    }
    
    
    

    const handleSnipeButtonClick = async () => {
        //DOM ACTIONS
        var messageDom = document.getElementById("message-box");
        var el = document.createElement('div');
        

        let currentItemState = getItemState(itemDetails.tokenAddress);
        if(currentItemState===0 || currentItemState===1){
            el.innerHTML = "Already sniped/sniping.";
            el.className="show";
            messageDom.appendChild(el);
            setTimeout(() => {
              messageDom.removeChild(el);
            }, 1500);
            return; // prompt already sniped or sniping message
        }
        else if(currentItemState===2 || currentItemState===-1 || currentItemState===-5){
            el.innerHTML = "SNIPING!";
            el.className="show";
            messageDom.appendChild(el);
            setTimeout(() => {
              messageDom.removeChild(el);
            }, 1500);
            console.log(el);
            dispatch({
                type: types.UPDATE_BASKET_ITEM,
                payload: {...itemDetails, itemState:0}
            })
            const snipeResponse = await snipeItem(itemDetails);
            if(snipeResponse===1){
                dispatch({
                    type: types.UPDATE_BASKET_ITEM,
                    payload: {...itemDetails, itemState:1}
                });
            }
            else{
                dispatch({
                    type: types.UPDATE_BASKET_ITEM,
                    payload: {...itemDetails, itemState: -1}
                });
            }
        }
        else{
            el.innerHTML = "ERROR";
            el.className="show";
            messageDom.appendChild(el);
            setTimeout(() => {
              messageDom.removeChild(el);
            }, 1500);
            //first interaction with the item so
            console.log("Bilgehan error: in handleSnipeButtonClick");
            return;
        }
    }

    const styles = {
        imageStyle: {
            height:"18vh",
            width: "100%"
        },
        itemInfo: {
            display:"flex",
            justifyContent:"space-between"
        },
    }
    return (
        <div style={{backgroundColor: theme.primary, borderRadius:"0.5vw", width:"10vw"}}>
            <div id="snipe-button" onClick={handleSnipeButtonClick}>
                <img src={snipingIcon} alt="S" style={{width:25, height:25, marginRight:"0.4vw",}} />
                Snipe
            </div>
            <div id="item-wrapper" style={checkInBasket(itemDetails) ? {border:  `4px solid ${theme.gold}`} : null}
                onClick={()=>{handleItemClick(2)}}>
                <div style={styles.imageStyle} >
                    <img src={itemDetails?.extra?.img} alt="Image error" style={{width:"100%", height:"100%"}} />
                </div>
                <div style={styles.itemInfo}>
                    <span>
                        {itemDetails?.title}
                    </span>
                    <span>
                        ⍜{itemDetails?.rarity?.moonrank === undefined ? "N/A" : itemDetails.rarity.moonrank.rank}
                    </span>
                </div>
                <div style={{textAlign:"right", marginTop:"1vh", fontSize:18}}>
                    {itemDetails?.price} ◎
                </div>
            </div>
            <div style={{position:"fixed", left:"2vw", top:"4vh"}} id="message-box"></div>
        </div>
    )
}


const Listings = () => {
    const state = ContextValue()[0];
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();


    const snipeItem = async (item) => {
        
        try{

            //const ataAddress = getAssociatedTokenAddress(new PublicKey(item.tokenMint), publicKey, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);

            //send buy request to Magic Eden
            const res = await sendBuyInstruction(publicKey.toBase58(), item.seller, item.auctionHouse, item.tokenMint, 
            item.tokenAddress, item.price);

            //Magic eden returns txn
            const txn = Transaction.from(res.data.txSigned.data);

            console.log("Transaction before signing: ", txn);

            const txnSigned = await signTransaction(txn);

            console.log("Transaction after signing: ", txn);


            //send to chain
            const response = await sendAndConfirmRawTransaction(connection, txnSigned.serialize(), 
            {skipPreflight: true, preflightCommitment: 'processed', maxRetries: 3, commitment: 'processed'});
            
            console.log(response);
            return 1;
        }
        catch(error){
            return -1;
        }

        

    }

    const checkInBasket = (itemDetails) => {
        if(state.basket.some(e=>e.tokenAddress===itemDetails.tokenAddress)){
            return true;
        }
        return false;
    }

    const getItemState = (tokenAddress) => {
        //0 stands for sniping
        //-1 stands for failed
        //1 stands for success
        //2 stands for in basket
        //-5 stands for first interaction

        let rest = (state.basket.find((element)=>{ return element.tokenAddress === tokenAddress}))?.itemState;
        return typeof rest === 'undefined' ? -5 : rest;
    }
    return (
        <div style={{display:"grid", rowGap:"10px",
        gridTemplateColumns:"auto auto auto auto auto"}} >
            {
            state.currentCollectionListings?.sort((a,b)=>{
                switch (state.sortBy){
                    case "price-increasing":
                        return a?.price - b?.price;
                    case "price-decreasing":
                        return b?.price - a?.price;
                    case "rarity-increasing":
                        return a?.rarity?.moonrank?.rank - b?.rarity?.moonrank?.rank;
                    case "rarity-decreasing":
                        return b?.rarity?.moonrank?.rank - a?.rarity?.moonrank?.rank;
                }
                }).slice(0,20).map((element,index)=>
            <ListItem key={index} itemDetails={element} checkInBasket={checkInBasket}
            index={index} snipeItem={snipeItem} getItemState={getItemState} />)
            }
        </div>
    )
}


export default Listings;