import { ContextValue } from '../../context/Context';
import LeftMain from './LeftMain/LeftMain';
import Loading from '../Loading/Loading';
import MiddleMainInitial from './MiddleMainCommons/MiddleMainInitial';
import MiddleMainSniperTool from './MiddleMainSniperTool/MiddleMainSniperTool';
import MiddleMainAutoBuy from './MiddleMainAutoBuy/MiddleMainAutoBuy';
import { fetchAllCollections } from "../../actions/collections";
import types from "../../actions/types";
import theme from '../../theme/theme';
import RightMain from './RightMain/RightMain';


const MainPage = () => {
    const [state, dispatch] = ContextValue();
    console.log("burdan");
    
    const getAllCollections = () => {
        fetchAllCollections().then(responses => {
            dispatch({
                type: types.FETCH_ALL_COLLECTIONS,
                payload: responses
            });
        }).catch(errors => {
        console.log(errors);
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
                    state.currentPage === 1 ? <MiddleMainInitial header={"Sniper Tool"} ItemSelectedScreen={MiddleMainSniperTool} /> : 
                    state.currentPage === 2 ? <MiddleMainInitial header={"Auto Buy"} ItemSelectedScreen={MiddleMainAutoBuy} /> : null
                }
            </div>
        </> :
        <Loading callBackFunction={getAllCollections} callCallBack={true} />
        
    )
}

export default MainPage;