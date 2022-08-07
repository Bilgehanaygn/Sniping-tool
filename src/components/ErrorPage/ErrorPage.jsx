import theme from '../../theme/theme';
import './errorpage.css';


const ErrorPage = ({errorPageCallBack, errorPageText, errorImage}) => {
    
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
            <div style={{borderRadius:"0.5vh", textAlign:"center", backgroundColor:"#282c34", padding:"5vh"}}>
                <div style={{fontSize:20}}>
                    {errorPageText}
                </div>
                <img src={errorImage} alt="image1" style={{width:"40vh", height:"40vh",
                borderRadius: "5vh", zIndex:4
                }} />
                <div>
                    <button id="errorpage-close-button" onClick={errorPageCallBack}>
                        Close
                    </button>
                </div>

            </div>
        </div>
    )

}


export default ErrorPage;