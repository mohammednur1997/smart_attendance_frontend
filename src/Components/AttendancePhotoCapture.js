import React, {Component,Fragment} from 'react';
import { Col, Container, Row} from "react-bootstrap";
import JEEFACETRANSFERAPI from "../WebGL2/jeelizFaceTransfer.module";
import Webcam from "react-webcam";
import spinner from "../Assets/Image/spinner.svg";
import imagePlaceholder from "../Assets/Image/imagePlaceholder.svg";
import SweetAlert from "react-bootstrap-sweetalert";
import {RequiredPhoto} from "../Helper/ToastHelper";
import {Redirect} from "react-router";
class AttendancePhotoCapture extends Component {

    constructor() {
        super();
        this.state={
            PreviewSpinner:"",
            spinner:spinner,
            photoSrc:imagePlaceholder,
            EPhoto:false,
            CameraError:false,
            Redirect:false
        }
        this.cameraRef=React.createRef();
    }
   /* componentDidMount() {
        this.OpenWebGLCamera();
    }*/
    OpenWebGLCamera=()=>{
        JEEFACETRANSFERAPI.init({
            canvasId:"canvasID",
            NNCPath:'model2/',
            hysteresis:0.1,
            isMirror:true,
            callbackReady:(err)=>{
                if(err){
                    console.log(err);
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
              /*  let RightEye= FaceMovement[8];
                let LeftEye= FaceMovement[9];
                if(RightEye>=0.75  && LeftEye>=0.75){
                    this.onCapture();
                }*/
                this.onCapture();
            }
        },1000)
    }

    onCapture=()=>{
        setTimeout(()=>{
            if(this.cameraRef.current!==null){
                let PhotoBase64= this.cameraRef.current.getScreenshot();
                sessionStorage.setItem('photoSrc',PhotoBase64);
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
        if(this.state.EPhoto===true){
            this.setState({Redirect:true})
        }
        else {
            RequiredPhoto();
        }
    }

    pageRedirect=()=>{
        if(this.state.Redirect===true){
            return (
                <Redirect to="/AttendanceInfo"/>
            )
        }
    }
    render() {
        return (
            <Fragment>
                <Container>
                    <Row className="d-flex text-center justify-content-center">
                        <Col className="text-center text-danger  p-3" md={4} sm={12} lg={4}>
                            <h4>Open and close your eye to capture the picture</h4>
                        </Col>
                        <Col className="text-center " md={4} sm={12} lg={4}>
                            <img className={this.state.PreviewSpinner+" w-50"} src={this.state.spinner}/>
                            <canvas className="canvasClass" id="canvasID"/>
                        </Col>
                        <Col className="text-center" md={4} sm={12} lg={4}>
                            <img id="PersonPhoto" className="preview-img" src={this.state.photoSrc}/>
                            <button onClick={this.next} className="btn m-3 btn-block btn-danger">Next</button>
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

                {this.CameraErrorAlert()}
                {this.pageRedirect()}
            </Fragment>
        );
    }
}

export default AttendancePhotoCapture;
