import theme from "../../../theme/theme";
import './middlemainfeedback.css';
import ErrorPage from "../../ErrorPage/ErrorPage";
import { useState } from "react";
import successImage from '../../../assets/successImage.png';

const MiddleMainFeedback = () => {
    const [isError, setIsError] = useState(false);

    const handleSendClick = async () => {
        let elements = document.getElementsByClassName('feedback-input');
        for(let item of elements){
            item.value="";
        }
        setIsError(true);
    }

    const handleCloseCallback = () => {
        setIsError(false);
    }

    return(
        
        <div style={{color:"white", height:"92vh", maxHeight:"92vh", width:"calc(100vw - (200px + 1.5vw))", paddingTop:"5vh", overflowY:"auto"}} >
            {isError ? <ErrorPage errorPageCallBack={handleCloseCallback} errorPageText="Success!" errorImage={successImage} /> : null}

            <div style={{width:"50vw", backgroundColor:"#282c34", margin:"auto", padding:"5vh", borderRadius:"2vh",
                display:"flex", flexDirection:"column", justifyContent:"space-around"}} >
                <div style={{fontWeight:500, fontSize:20}} >
                    Feedback Form
                </div>
                <div className="feedback-input-wrapper">
                    <div>
                        Title
                    </div>
                    <input className="feedback-input" type="text" placeholder="E.g. Problem with holder verification" />
                </div>
                <div className="feedback-input-wrapper">
                    <div>
                        Discord ID
                    </div>
                    <input className="feedback-input" type="text" placeholder="E.g. DEVBilge#6647" />
                </div>
                <div className="feedback-input-wrapper">
                    <div>
                        Your Message
                    </div>
                    <textarea className="feedback-input" rows="5" defaultValue="Some long text">
                    </textarea>

                </div>

                <button id="feedback-send-button" onClick={handleSendClick}>
                    Send
                </button>

            </div>
        </div>
    )


}




export default MiddleMainFeedback;






