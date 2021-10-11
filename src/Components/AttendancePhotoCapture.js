import React, {Component,Fragment} from 'react';
import { Col, Container, Row, Form} from "react-bootstrap";
import JEEFACETRANSFERAPI from "../WebGL2/jeelizFaceTransfer.module";
import Webcam from "react-webcam";
import Loader from "./Loader";
import spinner from "../Assets/Image/spinner.svg";
import imagePlaceholder from "../Assets/Image/imagePlaceholder.svg";
import SweetAlert from "react-bootstrap-sweetalert";
import {RegistrationSuccess, RequestFail, RequiredPhoto, AttendanceSuccess} from "../Helper/ToastHelper";
import {Redirect} from "react-router";
import moment from "moment";
import axios from "axios";
import {onRegistrationBody, onRegistrationURL, onStartWorkBody, onAttendanceURL, onEndWorkBody} from "../APIServices/APIServices";
class AttendancePhotoCapture extends Component {

    constructor() {
        super();
        this.state={
            loaderDIV:"d-none",
            PreviewSpinner:"",
            spinner:spinner,
            photoSrc:imagePlaceholder,
            EPhoto:false,
            CameraError:false,
            Redirect:false,
            Eid:"",
            atten:""
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

        getAttendance=()=>{
           let employeeId = this.state.Eid;
           let day = moment().format('dddd');
           let start_time = moment().format('h:mm a');
           let end_time = moment().format(' h:mm a');
            let date  = moment().format('L');
           if(this.state.atten == 1){
               this.startWorkHours(employeeId, date, start_time, day);
           }else if(this.state.atten == 2){
               this.EndWorkHours(employeeId, date, end_time, day);
            }

        }

    startWorkHours=(employee_id, date,in_time, day)=>{

        this.setState({loaderDIV:""})

        axios.post(onAttendanceURL(),onStartWorkBody(
            employee_id, date,in_time, day
        )).then((res)=>{
            this.setState({loaderDIV:"d-none"})
            console.log(res.data)
            if(res.status===200 && res.data.result === "pass"){
                AttendanceSuccess(res.data.message);
                /*this.setState({ Redirect:true})*/
            }
            else {
                RequestFail();
            }
        }).catch((err)=>{
            this.setState({loaderDIV:"d-none"})
            RequestFail();
        })
    }

    EndWorkHours=(employee_id, date, end_time, day)=>{
        this.setState({loaderDIV:""})

        axios.post(onAttendanceURL(),onEndWorkBody(
            employee_id, date, end_time, day
        )).then((res)=>{
            this.setState({loaderDIV:"d-none"})

            console.log(res.data.message)

            if(res.status===200 && res.data.result === "pass"){
                AttendanceSuccess(res.data.message);
            }
            else {
                RequestFail();
            }
        }).catch((err)=>{
            this.setState({loaderDIV:"d-none"})
            RequestFail();
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
                       {/* <Col className="text-center text-danger  p-3" md={4} sm={12} lg={4}>
                            <h4>Open and close your eye to capture the picture</h4>
                        </Col>
                        <Col className="text-center " md={4} sm={12} lg={4}>
                            <img className={this.state.PreviewSpinner+" w-50"} src={this.state.spinner}/>
                            <canvas className="canvasClass" id="canvasID"/>
                        </Col>*/}

                        <Col className="p-3" md={4} sm={12} lg={4}>

                                <label className="form-label text-black text-lg-left">Employee ID</label>
                                <input onChange={(e)=>this.setState({Eid:e.target.value})}  className="form-control" type="text"/>


                                <Form.Group>
                                    <Form.Label>Select one option</Form.Label>
                                    <Form.Control
                                        as="select"
                                        onChange={(e)=>this.setState({atten:e.target.value})}
                                    >
                                        <option value="0">Choose One</option>
                                        <option value="1">Start</option>
                                        <option value="2">Exist</option>
                                    </Form.Control>
                                </Form.Group>

                            {/*<img id="PersonPhoto" className="preview-img" src={this.state.photoSrc}/>*/}


                            {/*<button onClick={this.next} className="btn m-3 btn-block text-center btn-danger">Next</button>*/}

                            <button onClick={this.getAttendance} className="btn m-3 btn-block text-center btn-danger">Get Attendance</button>
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

export default AttendancePhotoCapture;
