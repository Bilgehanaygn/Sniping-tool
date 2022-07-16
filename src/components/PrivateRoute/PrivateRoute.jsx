import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import sniperLogoImage from '../../assets/snipe-logo-alter.png';

const PrivateRoute = ({children}) => {
    const {publicKey} = useWallet();

    return (
        publicKey ? children : 
        <div style={{width:"100vw", height:"100vh",
        backgroundImage:`url(${sniperLogoImage})`, backgroundPosition:"center", backgroundRepeat:"no-repeat", backgroundSize:"contain"}} >
            <div style={{position:"fixed", top:"10%", right:"5%"}} >
                <WalletMultiButton />
            </div>
        </div>
    )
        
}

export default PrivateRoute;