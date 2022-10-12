import React, { useState } from 'react';
import { NFTStorage, File } from 'nft.storage'
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
const APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc0MThBNTQ5M2QxMjNkZEEyYTBDY0Y0MzM4OUU3OTc2NjNjNWI1NDciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NTU3NjQyMDY0MywibmFtZSI6IklQRlMgVVBMT0FERVIifQ.OCZ_IjOydSgKkYZ-MScH0k6EjZCZOMBFZt_pwAL-gsM'


const IPFSUploader = () => {
    const [uploadFile, setUploadFile] = useState();
    const [txStatus, setTxStatus] = useState();
    const [errorMessage, setErrorMessage] = useState(null);
    const [title, setTitle] = useState();
    const [link, setLink] = useState();
    const [cid, setCid] = useState();
    const [imageView, setImageView] = useState();
    const [metaDataURL, setMetaDataURl] = useState();

    const handleFileUpload = (event) => {
        setUploadFile(event.target.files[0]);
        setTxStatus("");
        setImageView("");
        setMetaDataURl("");
        setErrorMessage("");
        setLink("")
    }

    const uploadNFTContent = async (inputFile) => {
        const nftStorage = new NFTStorage({ token: APIKEY, });
        try {
            setTxStatus("Uploading File to IPFS & Filecoin via FRNS Network.");
            const metaData = await nftStorage.store({
                name: title,
                description: "FRNS FILE",
                image: inputFile
            });
            console.log(metaData);
            return metaData;
        } catch (error) {
            setErrorMessage("Could not Upload to FRNS Network");
            setTxStatus("");
            console.log(error);
        }
    }

    const mintNFTToken = async (event, uploadFile) => {
        event.preventDefault();
        const metaData = await uploadNFTContent(uploadFile);
        previewNFT(metaData);
        setLink(metaData.data.image.href);
    }

    const previewNFT = (metaData, mintNFTTx) => {
        let imgViewString = getIPFSGatewayURL(metaData.data.image.href);
        setImageView(imgViewString);
        setMetaDataURl(getIPFSGatewayURL(metaData.url));
        setCid(metaData.data.image.host);
        setTxStatus("File Uploaded Successfully! Check Status.");
        setErrorMessage("");
    }

    const getIPFSGatewayURL = (ipfsURL) => {
        let urlArray = ipfsURL.split("/");
        let ipfsGateWayURL = `https://${urlArray[2]}.ipfs.dweb.link/${urlArray[3]}`;
        return ipfsGateWayURL;
    }

    const copy = async () => {
        await navigator.clipboard.writeText(cid);
        alert('Text copied');
    }

    return (
        <div className="section">
            <div className="container">
                <div className="row full-height justify-content-center">
                    <div className="col-12 text-center align-self-center py-5">
                        <div className="section pb-5 pt-5 pt-sm-2 text-center">
                            <h6 className="mb-0 pb-3"><span>UPLOAD</span><span>STATUS</span></h6>
                            <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" />
                            <label for="reg-log"></label>
                            <div className="card-3d-wrap mx-auto">
                                <div className="card-3d-wrapper">
                                    <div className="card-front">
                                        <div className="center-wrap">
                                            <div className="section text-center">
                                                <h4 className="mb-4 pb-3">IPFS FILE UPLOADER</h4>
                                                <p style={{ color: "green" }}>{txStatus}</p>
                                                <p style={{ color: "red" }}>{errorMessage}</p>
                                                <div className="form-group">
                                                    <input type="email"
                                                        value={title}
                                                        className="form-style"
                                                        placeholder="File Name"
                                                        onChange={e => setTitle(e.target.value)}
                                                    />
                                                    <i className="input-icon uil uil-at"></i>
                                                </div>
                                                <div className="form-group mt-2">
                                                    <input type="file"
                                                        className="form-style"
                                                        placeholder="Insert File"
                                                        onChange={handleFileUpload}
                                                    />
                                                    <i className="input-icon uil uil-file-plus"></i>
                                                </div>
                                                <button className="btn mt-4" onClick={e => mintNFTToken(e, uploadFile)}>UPLOAD</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-back">
                                        <div className="center-wrap">
                                            {!metaDataURL ? <><h5>Powered by FRNS <br />Network and <a href='https://filecoin.io/'>Filecoin</a></h5><h6 style={{ color: "#6497b1", letterSpacing: "5px" }}>FOR ZOOCIETY</h6><>Made with ❤️ by PZOOTECH</></> :
                                                <div className="section text-center">
                                                    <p style={{ color: "red" }}>{errorMessage}</p>
                                                    <h4 className="mb-4 pb-3">UPLOAD RESULTS</h4>
                                                    <div className="form-group">
                                                        {imageView && <p><a href={imageView} >IPFS Gateway Link</a></p>}
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        {metaDataURL && <p><a href={metaDataURL} >IPFS Metadata</a></p>}
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        {link && <p><a href={link} >IPFS URL Link</a></p>}
                                                    </div>
                                                    <button onClick={copy} disabled={!cid} className="btn mt-4">COPY CID</button>

                                                </div>
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IPFSUploader

