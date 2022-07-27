import './middlemainmintingtool.css';
import { ContextValue } from '../../../context/Context';
import LaunchpadSelectionPage from './LuanchpadSelectionPage/LaunchpadSelectionPage';


const MiddleMainMintingTool = () => {
    const state = ContextValue()[0];


   return (
        <div style={{color:"white", height:"92vh", maxHeight:"92vh", width:"calc(100vw - (200px + 1.5vw))"}} >
            <LaunchpadSelectionPage />
        </div>
   )

}


export default MiddleMainMintingTool;