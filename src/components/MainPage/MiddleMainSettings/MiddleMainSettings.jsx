import lockImage from '../../../assets/lock.png';
import theme from '../../../theme/theme';
import './middlemainsettings.css';

const MiddleMainSettings = () => {

    const styles = {
        mainDiv:{
            minHeight:"92vh", maxHeight:"92vh",
            backgroundColor:"theme.background", color:"white",textAlign:"center",
            overflow:"hidden", width:"calc(100vw - (200px + 1.5vw))",
            //additional for locking
            position:"relative"
        },
        lockedArea:{
            position:"absolute", width:"100%", height:"100%", backgroundColor:"#000",
            left:0,top:0, opacity:0.5, 
        },
        lockImageDiv:{
            position:"absolute", width:"100%", height:"100%", 
            left:0,top:0,
            backgroundImage:`url(${lockImage})`, backgroundPosition:"center", backgroundSize:"contain",
            backgroundRepeat: "no-repeat", zIndex:5
        },
    }

    return (
        <div style={styles.mainDiv} >
            <div style={styles.lockedArea} ></div>
            <div style={styles.lockImageDiv} ></div>
            <div style={{color:"white", fontSize:20, marginTop:"10vh"}}>
                <div style={{marginBottom:"3vh"}} >
                    Current RPC Endpoint: https://ssc-dao.genesysgo.net/
                </div>
                <div style={{marginBottom:"3vh"}}>
                    <span style={{marginRight:"2vh"}}>
                        Your custom RPC Endpoint: 
                    </span>
                    <input style={{padding:"0.5vh", fontSize:17}} type="text" placeholder="E.g. https://ssc-dao.genesysgo.net/" />
                </div>
                <div style={{marginBottom:"3vh"}}>
                    You have to check the availability of your endpoint by clicking the "Check" button below.
                </div>
                <div style={{marginBottom:"3vh"}}>
                    If the endpoint works fine, save button will automatically be available.
                </div>
                <div style={{marginTop:"10vh"}} >
                    <button className='simple-button' style={{marginRight:"5vw"}} >
                        Check
                    </button>
                    <button className='simple-button' >
                        Save
                    </button>
                </div>

            </div>
        </div>
    )
}



export default MiddleMainSettings;