import types from '../actions/types';

export const initialState = {
    allCollections: [],
    loadingDone: false,
    selectedCollectionInfo: null,
    currentCollectionListings: [],
    currentCollectionLoadingDone: false,
    sortBy: "price-increasing",
    basket: [],
    basketTotal: 0,
    currentPage: 1,
    anyCollectionSelected: false,
    autoBuyRunning:false
};

const reducer = (state, action) => {

    switch(action.type){
        
        case types.FETCH_ALL_COLLECTIONS:
            // let allItems = [];
            // for(let res of action.payload){
            //     if(res.status === 200){
            //         allItems = allItems.concat(res.data);
            //     }
            // }
            return {
                ...state,
                loadingDone: true,
                allCollections: action.payload
            };
        case types.FETCH_SELECTED_COLLECTION_INFO:
            return {
                ...state,
                selectedCollectionInfo: action.payload
            };

        case types.FETCH_LISTINGS:
            return {
                ...state,
                currentCollectionListings: action.payload
            };
        case types.CURRENT_COLLECTION_LOADING_DONE:
            return {
                ...state,
                currentCollectionLoadingDone: action.payload
            }
        case types.SORT_BY:
            return {
                ...state,
                sortBy: action.payload
            };
        case types.CHANGE_PAGE:
            return {
                ...state,
                currentPage: action.payload
            };
        case types.SELECT_COLLECTION:
            return {
                ...state,
                anyCollectionSelected: action.payload
            };
        case types.SET_WALLET_BALANCE:
            return {
                ...state,
                walletBalance: action.payload
            };
        case types.AUTO_BUY_STATE:
            return {
                ...state,
                autoBuyRunning: action.payload
            };



        case types.ADD_BASKET:
            return {
                ...state,
                basket: [...state.basket, action.payload],
                basketTotal: (action.payload.itemState === 2|| action.payload.itemState === -5) ? 
                Math.round((state.basketTotal + action.payload.price)*1e2)/1e2 : 
                state.basketTotal
            };
        case types.REMOVE_BASKET_ITEM:
            //index of the item to be removed is fetched through action.payload
            let newArr = [...state.basket];
            newArr.splice(action.payload,1);
            let itemToRemove = state.basket[action.payload];
            return {
                ...state,
                basket: newArr,
                basketTotal: (itemToRemove?.itemState === 2) ? 
                Math.round((state.basketTotal - itemToRemove.price)*1e2)/1e2 :
                state.basketTotal
            };
        case types.UPDATE_BASKET_ITEM:
            //an item that already exists in the basket is sent through action.payload
            //find the item and replace with new one
            //find vs filter   -> find will stop as soon as it finds the requested item
            // so find is faster (filter check all items)
            //but doesn't work in this case
            return {
                ...state,
                basket: [
                    ...(state.basket.filter(element=>element.tokenAddress!==action.payload.tokenAddress)),
                    action.payload
                ]
            };
        case types.EMPTY_BASKET:
            return {
                ...state,
                basket: state.basket.filter(element=>element.itemState===0),
                basketTotal: 0
            }
        case types.LOADING_DONE:
            return {
                ...state,
                loadingDone: action.payload
            };
        default:
            return {...state};
    }
}

export default reducer;