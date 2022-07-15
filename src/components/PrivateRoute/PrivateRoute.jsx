import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const PrivateRoute = ({children}) => {
    const {publicKey} = useWallet();

    return (
        publicKey ? children : 
        <div style={{textAlign:"center"}} >
            Burasi Main Page
            <WalletMultiButton />
        </div>
    )
        
}

export default PrivateRoute;