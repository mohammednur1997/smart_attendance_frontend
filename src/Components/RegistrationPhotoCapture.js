import React, {Component,Fragment} from 'react';
import { Col, Container, Row} from "react-bootstrap";
import JEEFACETRANSFERAPI from '../WebGL1/jeelizFaceTransfer.module';
import Webcam from "react-webcam";
import SweetAlert from "react-bootstrap-sweetalert";
import {Redirect} from "react-router";
import {ErrorMessage, RegistrationSuccess, RequestFail, RequiredPhoto} from "../Helper/ToastHelper";
import imagePlaceholder from '../Assets/Image/imagePlaceholder.svg'
import spinner from '../Assets/Image/spinner.svg'
import axios from "axios";
import {onRegistrationBody, onRegistrationURL} from "../APIServices/APIServices";
import * as faceapi from "face-api.js";
import Loader from "./Loader";


class RegistrationPhotoCapture extends Component {

    constructor() {
        super();
        this.state={
            PreviewSpinner:"",
            spinner:spinner,
            photoSrc:imagePlaceholder,
            EPhoto:false,
            CameraError:false,
            Redirect:false,
            loaderDIV:"d-none",

        }
        this.cameraRef=React.createRef();
    }
    componentDidMount() {
        this.OpenWebGLCamera();
    }

    OpenWebGLCamera=()=>{
        JEEFACETRANSFERAPI.init({
            canvasId:"canvasID",
            NNCPath:'model2/',
            hysteresis:0.1,
            isMirror:true,
            callbackReady:(err)=>{
                if(err){
                    window.location.reload();
                    this.onCameraError()
                }
                else{
                    this.setState({PreviewSpinner:"d-none"})
                    this.getFaceMovement();
                }
            }
        })
    }

    getFaceMovement=()=>{
        setInterval(()=>{
            let FaceMovement=  JEEFACETRANSFERAPI.get_morphTargetInfluences();
            if(JEEFACETRANSFERAPI.is_detected()){
                let RightEye= FaceMovement[8];
                let LeftEye= FaceMovement[9];
                if(RightEye>=0.75  && LeftEye>=0.75){
                    this.onCapture();
                }
               /* this.onCapture();*/
            }
        },1000)
    }

    onCapture=()=>{
        setTimeout(()=>{
            if(this.cameraRef.current!==null){
                let PhotoBase64= this.cameraRef.current.getScreenshot();
                this.setState({photoSrc:PhotoBase64,EPhoto:true})
            }

        },1000)
    }

    CameraErrorAlert=()=>{
        if(this.state.CameraError===true){
            return(
                <SweetAlert danger title="Please Try Again" onConfirm={this.onCameraTryAgain}>
                </SweetAlert>
            )
        }
    }
    onCameraTryAgain=()=>{
        window.location.reload();
    }

    onCameraError=()=>{
        this.setState({CameraError:true})
    }

    next=()=>{
        let Eid = sessionStorage.getItem("employeeId")
        if(this.state.EPhoto===true){
            this.PhotoDesCal(Eid);
        }

        else {
            RequiredPhoto();
        }
    }


    postRegistrationData=(employee_id,photo_descriptor)=>{
        this.setState({loaderDIV:""})
        axios.post(onRegistrationURL(),onRegistrationBody(
            employee_id,photo_descriptor
        )).then((res)=>{
            this.setState({loaderDIV:"d-none"})
            if(res.status===200 && res.data===1){
                RegistrationSuccess();
            }
            else {
                RequestFail();
            }
        }).catch((err)=>{
            this.setState({loaderDIV:"d-none"})
            RequestFail();
        })
    }


    PhotoDesCal=(employee_id)=>{
        (async ()=>{
            this.setState({loaderDIV:""})
            await  faceapi.loadSsdMobilenetv1Model('/model1');
            await  faceapi.loadFaceLandmarkModel('/model1');
            await  faceapi.loadFaceRecognitionModel('/model1');
            const img = document.getElementById('PersonPhoto')
            const imgDes= await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

            try {
                let photo_descriptor= JSON.stringify(Array.from(imgDes['descriptor']))
                this.postRegistrationData(employee_id,photo_descriptor)
            }catch (e) {
                this.setState({loaderDIV:"d-none"})
                ErrorMessage("Take a Clear Picture")
            }


        })()
    }

    pageRedirect=()=>{
        if(this.state.Redirect===true){
            return (
                <Redirect to="/RegistrationInfo"/>
            )
        }
    }

    render() {
        return (
            <Fragment>
                <Container>
                    <Row className="d-flex text-center justify-content-center">
                        <Col className="text-center " md={4} sm={12} lg={4}>
                            <img className={this.state.PreviewSpinner+" w-50"} src={this.state.spinner}/>
                            <canvas className="canvasClass" id="canvasID"/>
                        </Col>
                        <Col className="text-center" md={4} sm={12} lg={4}>
                            <img id="PersonPhoto" className="preview-img" src={this.state.photoSrc}/>
                            <button onClick={this.next} className="btn m-3 btn-block btn-danger">Register</button>
                        </Col>
                    </Row>
                </Container>

                <Row className="d-flex  justify-content-center">
                    <Col className="text-center  p-3" md={4} sm={12} lg={4}>
                        <Webcam
                            onUserMediaError={this.onCameraError}
                            ref={this.cameraRef}
                            screenshotFormat="image/jpeg"
                            audio={false}
                            className="WebcamClass"
                        />
                    </Col>
                </Row>

                <div className={this.state.loaderDIV}>
                    <Loader/>
                </div>

                {this.CameraErrorAlert()}
                {this.pageRedirect()}
            </Fragment>
        );
    }
}

export default RegistrationPhotoCapture;
