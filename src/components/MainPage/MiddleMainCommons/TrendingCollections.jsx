
import './trendingcollections.css';
import { popularCollections } from '../../../actions/collections';
import { ContextValue } from '../../../context/Context';


const SquareItem = ({itemName, itemImage, onClick}) => {

    return (
        <div className="square-item" onClick={onClick} >
            <img src={itemImage} alt="Image" style={{width:"10vw", height:"10vw"}} />
            <div style={{width:"10vw", maxWidth:"10vw", overflow:"hidden", whiteSpace:"nowrap"}} >
                {itemName}
            </div>
        </div>
    )
}

const TrendingCollections = ({handleSelect}) => {
    const state = ContextValue()[0];

    const handleClick = (collectionSymbol) => {
        console.log("clicked");
        let selectedCollection = state.allCollections.find(collectionObject => collectionObject.symbol === collectionSymbol);
        handleSelect(selectedCollection);
    }

    return (
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around" }} >
            <div style={{background:"#282c34", padding:"2vh"}} >
                <div style={{marginBottom:"3vh", fontSize:"1.5em"}}>Popular Collections</div>
                <div style={{display:"grid", rowGap:"3vh", columnGap:"1vw", gridTemplateColumns:"auto auto auto"}} >
                    {
                        popularCollections.map((element, index)=>{
                            return <SquareItem key={index} onClick={()=>{handleClick(element.symbol);}} itemName={element.name} itemImage={element.image} />
                        })
                    }
                </div>
            </div>
            <div style={{background:"#282c34", padding:"2vh"}}>
                <div style={{marginBottom:"3vh", fontSize:"1.5em"}}>New Collections</div>
                <div style={{display:"grid", rowGap:"3vh", columnGap:"1vw", gridTemplateColumns:"auto auto auto"}} >
                    {
                        state.allCollections.slice(0,20).map((element,index)=>
                            <SquareItem key={index+21} onClick={()=>{handleClick(element.symbol);}} itemName={element.name} itemImage={element.image} />
                        )
                    }
                </div>
            </div>

        </div>

    )
}

export default TrendingCollections;