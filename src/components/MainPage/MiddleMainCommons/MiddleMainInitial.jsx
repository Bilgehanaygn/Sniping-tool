import { useState } from "react";
import { ContextValue } from "../../../context/Context";
import types from "../../../actions/types";
import theme from "../../../theme/theme";
import TrendingCollections from './TrendingCollections';
import './middlemaininitial.css';
import lockImage from '../../../assets/lock.png';




const Item = (props) => {
    const [mouseOver, setMouseOver] = useState(false);
    
    const styles= {
        itemWrapper: {
            fontSize: 25,
            display:"flex",
            flexDirection:"row",
            justifyContent:"start",
            alignItems:"center",
            marginBottom: "2vh",
            padding: "1vh 0vh 1vh 1.5vw",
            borderRadius:"1vh",
        },
        itemWrapperHover: {
            backgroundColor:`${theme.primary}`,
            cursor: "pointer"
        },
        itemImage: {
            width: "7vh",
            height: "7vh",
            marginRight: "2vw",
            borderRadius: "2vh"
        },
    };

    return (
        <div style={mouseOver ? {...styles.itemWrapper, ...styles.itemWrapperHover}: styles.itemWrapper} 
            onMouseOver={()=>{setMouseOver(true)}} onMouseLeave={()=>{setMouseOver(false)}}>
            <img src={props.element.image} alt={props.element.name + " image"} style={styles.itemImage}/>
            {props.element.name}
        </div>
    )

}


const MiddleMainInitial = (props) => {
    const [state, dispatch] = ContextValue();
    const [searchItem, setSearchItem] = useState("");
    const [selectedCollection, setSelectedCollection] = useState({});
    

    const handleChange = (e) => {
        setSearchItem(e.target.value);
    }

    const handleSelect = (element) => {
        return;
        setSelectedCollection(element);
        dispatch({
            type: types.CURRENT_COLLECTION_LOADING_DONE,
            payload: false
        })
        dispatch({
            type: types.SELECT_COLLECTION,
            payload: true
        })
    }


    const styles = {
        mainDiv: {
            minHeight:"92vh", maxHeight:"92vh",
            backgroundColor:"theme.background", color:"white",textAlign:"center",
            overflow:"hidden", width:"calc(100vw - (200px + 1.5vw))",
            //additional for locking
            position:"relative"
        },
        //additional to locking
        lockedArea:{
            position:"absolute", width:"100%", height:"100%", backgroundColor:"#000",
            left:0,top:0, opacity:0.5, 
        },
        lockImageDiv:{
            position:"absolute", width:"100%", height:"100%", 
            left:0,top:0,
            backgroundImage:`url(${lockImage})`, backgroundPosition:"center", backgroundSize:"contain",
            backgroundRepeat: "no-repeat", zIndex:5
        }
    }

    return (
        <div style={styles.mainDiv}>
            <div style={styles.lockedArea} ></div>
            <div style={styles.lockImageDiv} ></div>
            {
                state.anyCollectionSelected ? <props.ItemSelectedScreen selectedCollection={selectedCollection} /> : 
                <div >
                    <div style={{fontSize: 20, paddingBottom:"2.5vh", borderBottom:`2px solid ${theme.primary}`}}>
                        <div style={{fontSize:30, marginBottom:"1vw"}}>
                            SOL SHOT - {props.header}
                        </div>
                        <input id="search-input" type="text" placeholder="Search" onChange={handleChange} />
                    </div>
                    <div style={{marginTop:"2vh", height:"75vh", maxHeight:"75vh", overflowY:"auto"}}>
                        {
                            searchItem.length < 3 ? <TrendingCollections handleSelect={handleSelect}  /> : 
                            state.allCollections.filter(collection=>{
                                return collection.name ? collection.name.toLowerCase().includes(searchItem.toLowerCase())
                            : null}).map((element, index)=>{
                                return (
                                    <div key={index} onClick={()=>{handleSelect(element)}} >
                                        <Item element={element} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }            
        </div>
    )

}

export default MiddleMainInitial;
