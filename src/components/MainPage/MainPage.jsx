import { ContextValue } from '../../context/Context';
import LeftMain from './LeftMain/LeftMain';
import Loading from '../Loading/Loading';
import MiddleMainInitial from './MiddleMainCommons/MiddleMainInitial';
import MiddleMainSniperTool from './MiddleMainSniperTool/MiddleMainSniperTool';
import MiddleMainAutoBuy from './MiddleMainAutoBuy/MiddleMainAutoBuy';
import { fetchAllCollections } from "../../actions/collections";
import types from "../../actions/types";
import theme from '../../theme/theme';
import MiddleMainMintingTool from './MiddleMainMintingTool/MiddleMainMintingTool';
import MiddleMainHomePage from './MiddleMainHomePage/MiddleMainHomePage';
import MiddleMainPortfolio from './MiddleMainPortfolio/MiddleMainPortfolio';
import MiddleMainFeedback from './MiddleMainFeedback/MiddleMainFeedback';
import MiddleMainSettings from './MiddleMainSettings/MiddleMainSettings';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';


const MainPage = () => {
    const [state, dispatch] = ContextValue();
    const {connection} = useConnection();
    const {publicKey} = useWallet();


    console.log("burdan");
    
    const getAllCollections = async () => {

        const walletBalance = await connection.getBalance(publicKey);

        dispatch({
            type: types.SET_WALLET_BALANCE,
            payload: walletBalance
        })


        const response = await fetchAllCollections();

        dispatch({
            type: types.FETCH_ALL_COLLECTIONS,
            payload: response.data
        });

    }

    const styles = {
        mainDiv: {
            backgroundColor: theme.background,
            display:"flex",
            justifyContent:"start",
            alignItems:"start",
            width:"100vw", maxWidth:"100vw", height:"100vh", maxHeight:"100vh",
            paddingTop:"8vh"
        },
    }

    return (
        state.loadingDone ? 
        <>
            <div style={styles.mainDiv}>
                <LeftMain />
                {
                    state.currentPage === 0 ? <MiddleMainHomePage /> :
                    state.currentPage === 1 ? <MiddleMainInitial header={"Sniper Tool"} ItemSelectedScreen={MiddleMainSniperTool} /> : 
                    state.currentPage === 2 ? <MiddleMainInitial header={"Auto Buy"} ItemSelectedScreen={MiddleMainAutoBuy} /> : 
                    state.currentPage === 3 ? <MiddleMainMintingTool /> : 
                    state.currentPage === 4 ? <MiddleMainPortfolio /> : 
                    state.currentPage === 5 ? <MiddleMainFeedback /> : 
                    state.currentPage === 6 ? <MiddleMainSettings /> : null 

                }
            </div>
        </> :
        <Loading callBackFunction={getAllCollections} callCallBack={true} />
        
    )
}

export default MainPage;