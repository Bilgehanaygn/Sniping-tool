import './launchpadselectionpage.css';
import magicedenLogo from '../../../../assets/magicedenLogo.jpg';
import monkelabsLogo from '../../../../assets/monkelabsLogo.gif';
import lmnftLogo from '../../../../assets/lmnftLogo.jpg';
import metaplexLogo from '../../../../assets/metaplexLogo.jpg';
import { useState } from 'react';
import MintDetails from '../MintDetails/MintDetails';
import lockImage from '../../../../assets/lock.png';
import { getMintDetailsFromME } from '../../../../actions/mint';
import Loading from '../../../Loading/Loading';
import * as anchor from '@project-serum/anchor';
import { TokenMetadataProgram } from '@metaplex-foundation/js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SystemProgram, SYSVAR_RENT_PUBKEY, SYSVAR_SLOT_HASHES_PUBKEY, PublicKey } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

const LaunchpadSelectionPage = () => {
    const [launchpadSelected, setLaunchpadSelected] = useState(false);
    const [collectionDetails, setCollectionDetails] = useState({});
    const [requestDetails, setRequestDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const {publicKey} = useWallet();
    const {connection} = useConnection();


    const handleSearchClick = async (type) => {
        setIsLoading(true);

        //1 stands for ME
        //2 stands for candyMachine
        //MonkeLabs and LMNFT are ristricted in beta version.
        
        try{
            let collectionDetailsInner;
            let requestDetailsInner;
            if(type===1){
                let searchInputData = document.getElementById('me-input').value;
                
                let collectionName = searchInputData.split('launchpad/')[1];
                
                let res = (await getMintDetailsFromME(collectionName)).data;
                let candyMachineId = res.mint.candyMachineId;
                let publicStage = res.state.stages[res.state.stages.length-1]

                const provider = new anchor.AnchorProvider(connection, [],);
                const idl = await anchor.Program.fetchIdl('CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb',provider);
                const program = new anchor.Program(idl, 'CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb', provider );
                const candyMachineObj = await program.account.candyMachine.fetch(candyMachineId);
                const candyMachineIdPublicKey = new PublicKey(candyMachineId);
            
                const launchStagesInfo = await anchor.web3.PublicKey.findProgramAddress([anchor.utils.bytes.utf8.encode('candy_machine'), 
                anchor.utils.bytes.utf8.encode('launch_stages'), candyMachineIdPublicKey.toBuffer()], program.programId);
                const launchStagesObject = await program.account.launchStagesInfo.fetch(launchStagesInfo[0].toBase58());

                const walletLimitInfo = await anchor.web3.PublicKey.findProgramAddress([anchor.utils.bytes.utf8.encode('wallet_limit'),
                candyMachineIdPublicKey.toBuffer(), publicKey.toBuffer()], program.programId)
                const masterEdition = await anchor.web3.PublicKey.findProgramAddress([anchor.utils.bytes.utf8.encode('metadata'),
                TokenMetadataProgram.publicKey.toBuffer(), publicKey.toBuffer(),
                anchor.utils.bytes.utf8.encode('edition') ], TokenMetadataProgram.publicKey);
                const metadata = await anchor.web3.PublicKey.findProgramAddress([anchor.utils.bytes.utf8.encode('metadata'),
                TokenMetadataProgram.publicKey.toBuffer(), candyMachineIdPublicKey.toBuffer()], TokenMetadataProgram.publicKey);

                console.log(launchStagesObject);

                collectionDetailsInner = {
                    type: 1,
                    name: res.name,
                    image: res.image,
                    description: res.description,
                    supply: res.size,
                    remaining: res.state.itemsRemaining,
                    candyMachineId: candyMachineId,
                    publicMintPrice: publicStage.price/1000000000,
                    publicStartTime: launchStagesObject.stages[launchStagesObject.stages.length-1].startTime.toNumber()*1e3,
                    publicEndTime: launchStagesObject.stages[launchStagesObject.stages.length-1].endTime.toNumber()*1e3,
                    discord: res.discordLink,
                    website: res.websiteLink,
                    twitter: res.twitterLink,                    
                };

                requestDetailsInner = {
                    accounts:{
                        config: candyMachineObj.config,
                        candyMachine: candyMachineId,
                        launchStagesInfo: launchStagesInfo[0].toBase58(),
                        candyMachineWalletAuthority: candyMachineObj.walletAuthority,
                        mintReceiver: publicKey.toBase58(),
                        payer: publicKey.toBase58(),
                        payTo: launchStagesObject.stages[0].paymentAta.toBase58(),
                        payFrom: publicKey.toBase58(),
                        mint: '',
                        tokenAta: '',
                        metadata: metadata[0].toBase58(),
                        masterEdition: masterEdition[0].toBase58(),
                        walletLimitInfo: walletLimitInfo[0].toBase58(),
                        tokenMetadataProgram: TokenMetadataProgram.publicKey.toBase58(),
                        tokenProgram: TOKEN_PROGRAM_ID.toBase58(),
                        systemProgram: SystemProgram.programId.toBase58(),
                        rent: SYSVAR_RENT_PUBKEY.toBase58(),
                        orderInfo: candyMachineObj.orderInfo,
                        slotHashes: SYSVAR_SLOT_HASHES_PUBKEY.toBase58(),
                        notary: candyMachineObj.notary,
                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID.toBase58()
                    },
                    params: {
                        walletLimitInfoBump: walletLimitInfo[1],
                        inOrder: false,
                        blockhash: '',
                        needsNotary: true
                    }
                    
                };
                
            }
            else if(type===2){
                let candyMachineId = document.getElementById('candyMachine-input').value;
                if(candyMachineId.trim().length !== 44){
                    throw 'invalid input';
                }

            }
            setCollectionDetails(collectionDetailsInner);
            setRequestDetails(requestDetailsInner);
            setIsLoading(false);
            setLaunchpadSelected(true);
        }
        catch(err){
            console.log(err);
            setIsLoading(false);
            alert('Invalid search input');
        }
    }

    const styles = {
        lockedArea:{
            position:"absolute", width:"100%", height:"100%", backgroundColor:"black",
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
        isLoading ? <Loading /> : 
        launchpadSelected ? <MintDetails selectionCallBack={()=>{setLaunchpadSelected(false)}} collectionDetails={collectionDetails} 
            requestDetails={requestDetails} /> :
        <div style={{color:"white", height:"100%", fontSize:"1.5em", display:"flex", flexDirection:"row", 
            justifyContent:"space-around" }} >
            <div style={{height:"100%", display:"flex", flexDirection:"column",}} >
                <div className="launchpad-wrapper" style={{marginBottom:"10vh"}} >
                    <div className="launchpad-header" >
                        <img src={magicedenLogo} alt="Magic Eden" className="launchpad-logo" />
                        <span style={{fontWeight:600, textAlign:"center", marginLeft:"5vw"}} >
                            MagicEden Launchpad
                        </span>
                    </div>
                    <div>

                        <input id="me-input" type="text" placeholder="E.g. https://magiceden.io/launchpad/sol_shot" className='link-input' />
                    </div>
                    <div style={{textAlign:"center"}} >
                        <button className="select-launchpad-button" onClick={()=>{handleSearchClick(1)}} >
                            Search
                        </button>
                    </div>
                </div>
                <div className="launchpad-wrapper" style={{position:"relative"}} >
                    <div style={styles.lockImageDiv} >
                    </div>
                    <div style={styles.lockedArea} >
                    </div>
                    <div className="launchpad-header" >
                        <img src={lmnftLogo} alt="Magic Eden" className="launchpad-logo" />
                        <span style={{fontWeight:600, textAlign:"center", marginLeft:"5vw"}} >
                            LMNFT Launchpad
                        </span>
                    </div>
                    <div>

                        <input type="text" placeholder="E.g. https://www.launchmynft.io/collections/" className='link-input' />
                    </div>
                    <div style={{textAlign:"center"}} >
                        <button className="select-launchpad-button" >
                            Search
                        </button>
                    </div>
                </div>

            </div>
            <div style={{height:"100%", display:"flex", flexDirection:"column"}} >
                <div className="launchpad-wrapper" style={{marginBottom:"10vh", position:"relative" }} >
                    <div style={styles.lockImageDiv} >
                    </div>
                    <div style={styles.lockedArea} >

                    </div>
                    <div className="launchpad-header" >
                        <img src={monkelabsLogo} alt="Magic Eden" className="launchpad-logo" />
                        <span style={{fontWeight:600, textAlign:"center", marginLeft:"5vw"}} >
                            MonkeLabs Launchpad
                        </span>
                    </div>
                    <div>

                        <input type="text" placeholder="E.g. https://solshot.monkelabs.io/" className='link-input' />
                    </div>
                    <div style={{textAlign:"center"}} >
                        <button className="select-launchpad-button" >
                            Search
                        </button>
                    </div>
                </div>
                <div className="launchpad-wrapper" >
                    <div className="launchpad-header" >
                        <img src={metaplexLogo} alt="Magic Eden" className="launchpad-logo" />
                        <span style={{fontWeight:600, textAlign:"center", marginLeft:"5vw"}} >
                            CandyMachine V2
                        </span>
                    </div>
                    <div>

                        <input type="text" placeholder="E.g. EPx9DWSeT6lqnaCjbbFhhkRAfXad8fBprR9GnysySD2q" className='link-input' />
                    </div>
                    <div style={{textAlign:"center"}} >
                        <button className="select-launchpad-button" onClick={()=>{handleSearchClick(2)}} >
                            Search
                        </button>
                    </div>
                </div>

            </div>

            
        </div>
    )

}



export default LaunchpadSelectionPage;