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
            borderRadius:"2vh", backgroundColor:"rgb(40, 44, 52)",
        },
        selectedMenuItem:{
            backgroundColor: theme.primary
        }
    }
    return (
        <div style={styles.mainDiv}>
            <img src={logo} alt="image1" style={{width:"100%", height:"auto", marginBottom:"2vh", 
            borderBottom: `2px solid ${theme.primary}` }} />
            <WalletMultiButton />
            <div className="menu-item" onClick={()=>{handleMenuItemClick(1)}} style={state.currentPage === 1 ? styles.selectedMenuItem : null} >
                <img src={snipingIcon} alt="S" style={{width:"1.5em", height:"1.5em", marginRight:"1vw"}} />
                Sniper Tool
            </div>
            <div className="menu-item" onClick={()=>{handleMenuItemClick(2)}} style={state.currentPage === 2 ? styles.selectedMenuItem : null}>
                <svg style={{marginRight:"1vw"}} xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                    <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                </svg>
                Auto Buy
            </div>
            <div className="menu-item" onClick={()=>{handleMenuItemClick(3)}} style={state.currentPage === 3 ? styles.selectedMenuItem : null}>
                ⛏️ 
                <span style={{marginLeft:"1vw"}} >Minting Tool</span>
            </div>
            <div className="menu-item" onClick={()=>{handleMenuItemClick(4)}} style={state.currentPage === 4 ? styles.selectedMenuItem : null}>
                <svg style={{marginRight:"1vw"}} xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" fill="currentColor" className="bi bi-wallet" viewBox="0 0 16 16">
                    <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z"/>
                </svg>
                Portfolio Tracker
            </div>
            <div className="menu-item" onClick={()=>{handleMenuItemClick(5)}} style={state.currentPage === 5 ? styles.selectedMenuItem : null}>
                <svg style={{marginRight:"1vw"}} xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" fill="currentColor" className="bi bi-cash-coin" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
                    <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z"/>
                    <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z"/>
                    <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z"/>
                </svg>
                SL-TP
            </div>
            <div className="menu-item" onClick={()=>{handleMenuItemClick(6)}} style={state.currentPage === 6 ? styles.selectedMenuItem : null}>
            <svg style={{marginRight:"1vw"}} xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" fill="currentColor" className="bi bi-chat-left-text" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
            </svg>
                Feedback
            </div>
        </div>
    )
}

export default LeftMain;