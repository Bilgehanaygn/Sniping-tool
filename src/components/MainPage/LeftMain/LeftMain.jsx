import theme from "../../../theme/theme";
import logo from '../../../assets/snipe-logo-alter.png';
import snipingIcon from '../../../assets/sniping-icon.webp';

import './leftmain.css';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ContextValue } from "../../../context/Context";
import types from "../../../actions/types";


const LeftMain = () => {
    const [state, dispatch] = ContextValue();

    const handleMenuItemClick = (newPageNum) => {
        dispatch({
            type: types.SELECT_COLLECTION,
            payload: false
        })
        dispatch({
            type: types.CHANGE_PAGE,
            payload: newPageNum
        });
    }

    const styles = {
        mainDiv:{
            width:"155px", padding:"2vh 0.75vw", maxHeight:"88vh", margin:"0vw 25px", 
            display:"flex", flexDirection:"column",  color:"white", 
            borderRadius:"1vh", backgroundColor:"rgb(40, 44, 52)",
        },
        selectedMenuItem:{
            backgroundColor: theme.primary
        }
    }
    return (
        <div style={styles.mainDiv}>
            <img src={logo} alt="image1" style={{width:"100%", height:"auto", marginBottom:"2vh", 
            borderBottom: `2px solid ${theme.primary}` }} />
            <WalletMultiButton disabled={state.autoBuyRunning} />
            <button className="menu-item" disabled={state.autoBuyRunning} onClick={()=>{handleMenuItemClick(1)}} 
                style={state.currentPage === 1 ? {...styles.selectedMenuItem, cursor:state.autoBuyRunning ? "not-allowed" : "pointer" } : {cursor:state.autoBuyRunning ? "not-allowed" : "pointer"} } >
                <img src={snipingIcon} alt="S" style={{width:"1.5em", height:"1.5em", marginRight:"1vw"}} />
                Sniper Tool
            </button>
            <button className="menu-item" disabled={state.autoBuyRunning} onClick={()=>{handleMenuItemClick(2)}} style={state.currentPage === 2 ? {...styles.selectedMenuItem, cursor:state.autoBuyRunning ? "not-allowed" : "pointer" } : {cursor:state.autoBuyRunning ? "not-allowed" : "pointer"} }>
                <svg style={{marginRight:"1vw"}} xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                    <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                </svg>
                Auto Buy
            </button>
            <button className="menu-item" disabled={state.autoBuyRunning} onClick={()=>{handleMenuItemClick(3)}} style={state.currentPage === 3 ? {...styles.selectedMenuItem, cursor:state.autoBuyRunning ? "not-allowed" : "pointer" } : {cursor:state.autoBuyRunning ? "not-allowed" : "pointer"} }>
                ⛏️ 
                <span style={{marginLeft:"1vw"}} >Minting Tool</span>
            </button>
            <button className="menu-item" disabled={state.autoBuyRunning} onClick={()=>{handleMenuItemClick(4)}} style={state.currentPage === 4 ? {...styles.selectedMenuItem, cursor:state.autoBuyRunning ? "not-allowed" : "pointer" } : {cursor:state.autoBuyRunning ? "not-allowed" : "pointer"} }>
                <svg style={{marginRight:"1vw"}} xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" fill="currentColor" className="bi bi-wallet" viewBox="0 0 16 16">
                    <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z"/>
                </svg>
                My Portfolio
            </button>
            <button className="menu-item" disabled={state.autoBuyRunning} onClick={()=>{handleMenuItemClick(5)}} style={state.currentPage === 5 ? {...styles.selectedMenuItem, cursor:state.autoBuyRunning ? "not-allowed" : "pointer" } : {cursor:state.autoBuyRunning ? "not-allowed" : "pointer"} }>
            <svg style={{marginRight:"1vw"}} xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" fill="currentColor" className="bi bi-chat-left-text" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
            </svg>
                Feedback
            </button>
            <button className="menu-item" disabled={state.autoBuyRunning} onClick={()=>{handleMenuItemClick(6)}} style={state.currentPage === 6 ? {...styles.selectedMenuItem, cursor:state.autoBuyRunning ? "not-allowed" : "pointer" } : {cursor:state.autoBuyRunning ? "not-allowed" : "pointer"} }>
                <svg style={{marginRight:"1vw"}} xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                </svg>
                Settings
            </button>
        </div>
    )
}

export default LeftMain;