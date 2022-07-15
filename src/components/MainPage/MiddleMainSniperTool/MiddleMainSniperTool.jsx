import { useState, useEffect } from "react";
import { fetchCollectionDetails, fetchCollectionListings, fetchItemDetails } from "../../../actions/collections";
import types from "../../../actions/types";
import { ContextValue } from "../../../context/Context";
import Listings from './Listings';
import theme from "../../../theme/theme";
import Loading from "../../Loading/Loading";
import './middlemainsnipertool.css';
import CollectionDetailsHeader from "../MiddleMainCommons/CollectionDetailsHeader";
import RightMain from "../RightMain/RightMain";


const FooterButtons = ({offset, setOffset,}) => {
    
    const [state, dispatch] = ContextValue();

    const styles = {
        moveArrow: {
            width:"7vh",
            height:"7vh",
        },
    }

    const handleMoveBackClick = () => {
        setOffset(offset-1);
    }

    const handleMoveNextClick = () => {
        setOffset(offset+1);
    }
    

    return (
    <div style={{marginTop:"5vh"}} >
        <svg id="back-arrow-footer" onClick={offset===0 ? null : handleMoveBackClick} xmlns="http://www.w3.org/2000/svg" width="4vh" height="4vh" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
        <svg id="next-arrow-footer" onClick={offset >= 1 ? null : handleMoveNextClick} xmlns="http://www.w3.org/2000/svg" width="4vh" height="4vh" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
        </svg>
    </div>
    )

}


const MiddleMainSniperTool = ({selectedCollection}) => {
    const [state, dispatch] = ContextValue();
    const [offset, setOffset] = useState(0);
    //const [selectValue, setSelectValue] = useState("price-incerasing");

    const handleSelectChange = (newValue) => {
        dispatch({
            type: types.SORT_BY,
            payload: newValue
        })
    }
    console.log(offset);

    //each time next button is clicked, fetch collection details again
    //check if (20*offset) < listed, if so button is not disabled,
    //else button is disabled 

    //back button should be disabled if offset is 0

    console.log("yeniden");
    const getCollectionDetails = async () => {

        try{
            let collectionDetailsRes = await fetchCollectionDetails(selectedCollection.symbol);

            dispatch({
                type: types.FETCH_SELECTED_COLLECTION_INFO,
                payload: {...selectedCollection, ...collectionDetailsRes.data}
            })

            let collectionListings = (await fetchCollectionListings(selectedCollection.symbol, offset)).data;
            //collectionListings.data => array of 20 items

            let tokenAddressList = [];
            for(let item of collectionListings){
                tokenAddressList.push(item.tokenAddress);
            }

            //fetch details of every item
            //assign title attribute (#num) to related items in listings

            fetchItemDetails(tokenAddressList)
            .then(responses=>{
                for(let i=0;i<collectionListings.length;i++){
                    if(typeof responses[i]?.data === 'undefined' || typeof responses[i]?.data?.Title === 'undefined'){
                        collectionListings[i] = {...collectionListings[i], title: "#" + "NaN"};
                    }
                    else{
                        collectionListings[i] = {...collectionListings[i], title: "#" + responses[i]?.data?.Title.split("#")[1]};                                        
                    }
                }
    
                dispatch({
                    type: types.FETCH_LISTINGS,
                    payload: collectionListings
                })
            }).catch(error=>{
                console.log(error);
            })
            


            dispatch({
                type: types.CURRENT_COLLECTION_LOADING_DONE,
                payload: true
            })

        }
        catch(error){
            console.log(error);
        }

    }

    useEffect(()=>{
        getCollectionDetails();
        
    }, [offset]);

    const handleRefreshClick = () => {
        dispatch({
            type: types.CURRENT_COLLECTION_LOADING_DONE,
            payload: false
        })
        getCollectionDetails();
    }





    return (
        //if still old then return loading else, retrn new
        !state.currentCollectionLoadingDone ? <Loading callBackFunction={null} callCallBack={false} /> : 
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between" }} >
            <div style={{overflowY:"auto", height:"92vh", maxHeight:"92vh"}} >
                <CollectionDetailsHeader handleRefreshClick={handleRefreshClick} />
                <Listings />
                <FooterButtons offset={offset} setOffset={setOffset} />
            </div>
            <RightMain />

        </div>
    )
}


export default MiddleMainSniperTool;