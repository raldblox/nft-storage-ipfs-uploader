import React, { useState } from 'react';
import { Button, Navbar, Container, Offcanvas, Nav, NavDropdown, Form, Modal, InputGroup, Badge, Col } from 'react-bootstrap';
import { NFTStorage } from "nft.storage";
import PolygonNFT from "./zNFT.json";
import { ethers } from 'ethers';
const APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc0MThBNTQ5M2QxMjNkZEEyYTBDY0Y0MzM4OUU3OTc2NjNjNWI1NDciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MTc3NjcyNTE4MiwibmFtZSI6IlpPT0NJRVRZIn0.Df5xv2ITEgoUn-XXHOILXEjXYY_Eg2oTI8fv2IicVzs';
const nftContractAddress = '0xec8F480810B1CCc4E897C6001E9140D140366dbA';

const MintNFT = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [uploadedFile, setUploadedFile] = useState();
    const [imageView, setImageView] = useState();
    const [metaDataURL, setMetaDataURl] = useState();
    const [txURL, setTxURL] = useState();
    const [link, setLink] = useState();
    const [record, setRecord] = useState();
    const [title, setTitle] = useState();
    const [txStatus, setTxStatus] = useState();

    const handleFileUpload = (event) => {
        console.log("File is Uploaded");
        setUploadedFile(event.target.files[0]);
        setTxStatus("");
        setImageView("");
        setMetaDataURl("");
        setTxURL("");
    }

    const mintNFTToken = async (event, uploadedFile) => {
        event.preventDefault();
        //1. upload NFT content via NFT.storage
        const metaData = await uploadNFTContent(uploadedFile);
        //2. Mint a NFT token on Polygon
        // const mintNFTTx = await sendTxToPolygon(metaData, title, record);
        //3. preview the minted nft
        // previewNFT(metaData, mintNFTTx);
    }

    const uploadNFTContent = async (inputFile) => {
        const nftStorage = new NFTStorage({ token: APIKEY, });
        try {
            setTxStatus("Uploading NFT to IPFS & Filecoin via NFT.storage.");
            const metaData = await nftStorage.store({
                name: title,
                description: "rald.blox",
                image: inputFile
            });

            setMetaDataURl(getIPFSGatewayURL(metaData.url));
            setLink(metaData.data.image.href);
            let imgViewString = getIPFSGatewayURL(metaData.data.image.href);
            setImageView(imgViewString);
            return metaData;
        } catch (error) {
            setErrorMessage("Could not Save NFT to NFT.Storage - Aborted minting.");
            console.log(error);
        }
    }

    const sendTxToPolygon = async (metaData, title, record) => {
        try {
            setTxStatus("Sending Transaction to Polygon Blockchain.");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const connectedContract = new ethers.Contract(
                nftContractAddress,
                PolygonNFT.abi,
                provider.getSigner()
            );
            console.log("metadata", metaData.data.image.href, title, record);
            
            
            const mintNFTTx = await connectedContract.mintItem(metaData.data.image.href, title, record);
            return mintNFTTx;
        } catch (error) {
            setErrorMessage("Failed to Send Transaction to Polygon.");
            console.log(error);
        }
    }

    const previewNFT = (metaData, mintNFTTx) => {
        let imgViewString = getIPFSGatewayURL(metaData.data.image.href);
        setImageView(imgViewString);
        setMetaDataURl(getIPFSGatewayURL(metaData.url));
        setTxURL('https://polygonscan.com/tx' + mintNFTTx.hash);
        setTxStatus("NFT is minted successfully!");
    }

    const getIPFSGatewayURL = (ipfsURL) => {
        let urlArray = ipfsURL.split("/");
        let ipfsGateWayURL = `https://${urlArray[2]}.ipfs.dweb.link/${urlArray[3]}`;
        return ipfsGateWayURL;
    }

    return (
        <><div className='interface' style={{ margin: "0rem 0 2rem 0" }}>
            <h4><strong>IPFS UPLOADER</strong></h4>
            <div className='form-container'></div>
                <Form.Control
                    placeholder="Title (required)"
                    value={title}
                    type="text"
                    onChange={e => setTitle(e.target.value)}
                />
                <Form.Control
                    placeholder="Description (required)"
                    value={record}
                    type="text"
                    onChange={e => setRecord(e.target.value)}
                    style={{ margin: "1rem 0 1rem 0" }}
                />
            <Form.Control type="file" onChange={handleFileUpload} style={{ margin: "1rem 0 1rem 0" }}/>
            <button className='custom-btn btn-16' onClick={e => mintNFTToken(e, uploadedFile)} ><strong>MINT</strong></button>
            {txStatus && <p>{txStatus}</p>}
            {imageView && <p><a href={imageView}>IPFS Link</a></p>}
            {link && <p><a href={link}>IPFS Link</a></p>}
            {metaDataURL && <p><a href={metaDataURL}>IPFS Metadata</a></p>}
            {errorMessage}
        </div>
        </>
    );
}
export default MintNFT;