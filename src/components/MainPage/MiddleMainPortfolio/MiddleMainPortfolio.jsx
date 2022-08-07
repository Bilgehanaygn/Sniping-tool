import { ContextValue } from "../../../context/Context";
import theme from "../../../theme/theme";
import LineChart from "../../LineChart/LineChart";
import './middlemainportfolio.css';
import ErrorPage from "../../ErrorPage/ErrorPage";
import { useState } from "react";
import errorImage from '../../../assets/errorImage.png';

const AnalyzeItem = ({walletTokenDetails, callBack}) => {

    const styles={
        infoContainer: {
            display:"flex", flexDirection:"row", justifyContent:"space-between", padding:"0vh 1vh"
        },
        imageStyle: {
            width: "100%",
            height: "auto"
        },
    }

    return (
        <div id="portfolio-cartitem" onClick={callBack} >
            <img src={walletTokenDetails.image} style={styles.imageStyle} alt="img" />
            <div>
                <div style={{textAlign:"center", marginBottom:"2vh"}}>
                    {walletTokenDetails.name}
                </div>
                <div style={styles.infoContainer} >
                    <span>Holding Since:</span>
                    <span>BETA!</span>
                </div>
                <div style={styles.infoContainer} >
                    <span>Current Floor:</span>
                    <span>BETA!</span>
                </div>
                <div style={styles.infoContainer} >
                    <span>Highest Floor</span>
                    <span>BETA!</span>
                </div>
                <div style={{...styles.infoContainer, marginBottom:10}} >
                    <span>Net Profit:</span>
                    <span>BETA!</span>
                </div>
            </div>
        </div>
    )
}


const MiddleMainPortfolio = () => {
    const state = ContextValue()[0];
    const [isError, setIsError] = useState(false);

    const walletTokens = [
        {
            image:"https://i.hizliresim.com/48ayhwk.png",
            name:"SolShot #2999",
            holdingSince:"BETA!",
            currentFloor:"BETA!",
            highestFloor:"BETA!",
            netProfit:"BETA!",
        },
        {
            image:"https://arweave.net/TRaL4kdo68KAs_D4UitSvQE6_kI-msEjoTwM41oxS8c",
            name:"Quantum Trader #7976",
            holdingSince:"BETA!",
            currentFloor:"BETA!",
            highestFloor:"BETA!",
            netProfit:"BETA!",
        },
        {
            image:"https://famousfoxes.com/hd/1099.png",
            name:"Fox #1099",
            holdingSince:"BETA!",
            currentFloor:"BETA!",
            highestFloor:"BETA!",
            netProfit:"BETA!",
        },
        {
            image:"https://bafybeiaclj2dyfvm27kdwh2yhvdr77wnpdum6ccyd6outymxv527dchvna.ipfs.nftstorage.link/391.png?ext=png",
            name:"Blocksmith Labs #391",
            holdingSince:"BETA!",
            currentFloor:"BETA!",
            highestFloor:"BETA!",
            netProfit:"BETA!",
        },
        {
            image:"https://www.arweave.net/vKDjmZSxkwPjQqIR70G2Ty43if8zeTionqXT84YIyUA?ext=png",
            name:"Grim #9981",
            holdingSince:"BETA!",
            currentFloor:"BETA!",
            highestFloor:"BETA!",
            netProfit:"BETA!",
        },
        {
            image:"https://metadata.degods.com/g/2463-dead.png",
            name:"DeGod #2464",
            holdingSince:"BETA!",
            currentFloor:"BETA!",
            highestFloor:"BETA!",
            netProfit:"BETA!",
        },
        {
            image:"https://bafybeieximbzqxohkyugfy4acew5hroodukjexu5dsb5s3ljpw5c436wqm.ipfs.nftstorage.link/2424.png?ext=png",
            name:"Okay Bears #2425",
            holdingSince:"BETA!",
            currentFloor:"BETA!",
            highestFloor:"BETA!",
            netProfit:"BETA!",
        },
        {
            image:"https://i.hizliresim.com/2stiisy.jpg",
            name:"SolShot #2128",
            holdingSince:"BETA!",
            currentFloor:"BETA!",
            highestFloor:"BETA!",
            netProfit:"BETA!",
        },
        {
            image:"https://arweave.net/lE0EXLsbg0LEOfVgAZyg1yeb6YiqC31gG3J9hDuR-dQ",
            name:"Degen Ape #8874",
            holdingSince:"BETA!",
            currentFloor:"BETA!",
            highestFloor:"BETA!",
            netProfit:"BETA!",
        },
        {
            image:"https://bafybeign64rdkwchw3fc5l6o4i4tld2khplal42fjouhn7yjamc5a7ya3e.ipfs.nftstorage.link/5664.png?ext=png",
            name:"Rakkudo #5665",
            holdingSince:"BETA!",
            currentFloor:"BETA!",
            highestFloor:"BETA!",
            netProfit:"BETA!",
        },

    ]
    

    const labels = [
        '01/1','01/2','01/3','01/4',
        '02/1','02/2','02/3','02/4',
        '03/1','03/2','03/3','03/4',
        '04/1','04/2','04/3','04/4',
        '05/1','05/2','05/3','05/4',
        '06/1','06/2','06/3','06/4',
        '07/1','07/2','07/3','07/4',
        '08/1','08/2','08/3','08/4',
        '09/1','09/2','09/3','09/4',
        '10/1','10/2','10/3','10/4',
        '11/1','11/2','11/3','11/4',
        '12/1','12/2','12/3','12/4',
    ];
    
    const data = {
        labels: labels,
        datasets: [{
            label: 'Wallet Balance Weekly',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: `#000`,
            data: [1.5, 1.8, 1.1, 0.9, 1.3, 1.7, 2.1, 1.8, 2.1, 2.3, 1.9, 2.1, 1.6, 1.8, 1.6, 1.4, 1.7, 1.5, 1.75, 1.5, 1.3, 1.5, 1.7, 1.9,
            1.7, 1.8, 1.6, 1.9, 2.1, 2.3, 2.7, 3.1],
        }]
    };

    const handleClickCallBack = () => {
        setIsError(true);
    }

    return (
        <div style={{color:"white", height:"92vh", maxHeight:"92vh", width:"calc(100vw - (200px + 1.5vw))", overflowY:"auto",}} >
            {isError ? <ErrorPage errorPageCallBack={()=>{setIsError(false)}} errorPageText="Ooops! You are not a beta tester." errorImage={errorImage} /> : null}
            <div style={{}} >
                <div style={{width:"60vw", backgroundColor:`${theme.primary}`, margin:"auto", textAlign:"center", color:"#000", fontSize:"25px"}} >
                    Your (Dream) Wallet Balance
                    <LineChart chartData={data} />
                </div>
                <div style={{margin:"5vh 0vh", textAlign:"center"}} >
                    <svg style={{width:"1em", height:"1em", marginRight:"0.3vw"}} xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    The chart is a sample, snapshots of holders wallets will be taken every day after the mint.
                </div>
            </div>
            <hr/>
            <div style={{fontSize:"2em", textAlign:"center"}}>
                Your Holdings
            </div>
            
            <div style={{ display: "grid", rowGap:"5vh", columnGap: "1vw", gridTemplateColumns:"auto auto auto auto", margin:"5vh"}} >
                {walletTokens.map(element=>
                    <AnalyzeItem walletTokenDetails={element} callBack={handleClickCallBack} />                    
                )}
            </div>
            
        </div>
        
    )
}




export default MiddleMainPortfolio;