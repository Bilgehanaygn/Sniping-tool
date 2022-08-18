import { useEffect } from 'react';

import logo from '../../assets/snipe-logo-alter.png';
import './loading.css';



const Loading = ({callBackFunction, callCallBack}) => {
    
    if(callCallBack){
        useEffect(()=>{
            callBackFunction();
        }, []);
    }


    const styles = {
        mainDiv: {
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            left: 0,
            top: 0
        },
    }
    
    
    return (
        <div style={styles.mainDiv}>
            <div id="logo-wrapper">
                <img src={logo} alt="image1" style={{width:"82vh", height:"40vh",zIndex:4
                }} />
            </div>
        </div>
    )
}

export default Loading;