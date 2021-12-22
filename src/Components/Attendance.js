import React, {Component,Fragment} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import Loader from "./Loader";
import spinner from "../Assets/Image/spinner.svg";
import imagePlaceholder from "../Assets/Image/imagePlaceholder.svg";
import {SuccessMessage, ErrorMessage} from "../Helper/ToastHelper";
import moment from "moment";
import axios from "axios";
import {onStartWorkBody, onCheckInURL, onCheckOutURL, onEndWorkBody} from "../APIServices/APIServices";
import JEEFACETRANSFERAPI from "../WebGL2/jeelizFaceTransfer.module";
import * as faceapi from "face-api.js";
import SweetAlert from "react-bootstrap-sweetalert";
import Webcam from "react-webcam";



class Attendance extends Component {

    constructor() {
        super();
        this.state={
            loaderDIV:"d-none",
            PreviewSpinner:"",
            spinner:spinner,
            Redirect:false,
            atten:"",


            photoSrc:imagePlaceholder,
            CameraError:false,
            EPhoto:false,
            AttendancePhoto_descriptor:[],
            EmpList:[],
        }
        this.cameraRef=React.createRef();
    }
    componentDidMount() {

        this.OpenWebGLCamera();
        let EmpList =  JSON.parse(localStorage.getItem('list'))
        this.setState({EmpList:EmpList});
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


    AttendancePhotoDesCal=(value)=>{

        if(this.state.EPhoto === false){
            ErrorMessage("Take a picture to close your eye")
        }else{
            (async ()=>{
                this.setState({loaderDIV:""})
                await  faceapi.loadSsdMobilenetv1Model('/model1');
                await  faceapi.loadFaceLandmarkModel('/model1');
                await  faceapi.loadFaceRecognitionModel('/model1');
                const img=document.getElementById('PersonPhoto')
                const imgDes= await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

                try {
                    this.setState({AttendancePhoto_descriptor:imgDes['descriptor']})
                    this.FaceMatchingResult(value);
                }catch (e) {
                    this.setState({loaderDIV:"d-none"})
                    ErrorMessage("Take a Clear Picture")
                }

            })()
        }


    }



    FaceMatchingResult=(value)=>{
        let AttendancePhoto_descriptor= this.state.AttendancePhoto_descriptor;
        let EmpList=this.state.EmpList;


        for (let i = 0; i <= EmpList.length; i++) {
            let Existing_descriptor =new Float32Array(JSON.parse(EmpList[i]['photo_descriptor']))
            let distance= faceapi.euclideanDistance(AttendancePhoto_descriptor,Existing_descriptor);


            let similarity= 1-distance;
            if(similarity>=0.6){
                this.setState({loaderDIV:"d-none"})
                this.getAttendance(value)
                break;
            }
            else {
                this.setState({loaderDIV:"d-none"})
                window.location.reload();
                ErrorMessage("Face Not Match with any employee");
            }

        }

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

        getAttendance=(value)=>{

           let employeeId = sessionStorage.getItem("employeeId");
           let day = moment().format('dddd');
           let start_time = moment().format('h:mm a');
           let end_time = moment().format(' h:mm a');
            let date  = moment().format('YYYY-MM-DD');

           if(value === 1){
               this.startWorkHours(employeeId, date, start_time, day);
           }else if(value === 2){
               this.EndWorkHours(employeeId, date, end_time, day);
            }

        }

    startWorkHours=(employee_id, date,in_time, day)=>{

        this.setState({loaderDIV:""})
        axios.post(onCheckInURL(),onStartWorkBody(employee_id, date,in_time, day))
            .then((res)=>{
            this.setState({loaderDIV:"d-none"})
            if(res.status===200 && res.data.result === "pass"){
                SuccessMessage(res.data.message);
            }
            else {
                ErrorMessage(res.data.message);
            }
        }).catch((err)=>{
            this.setState({loaderDIV:"d-none"})
            ErrorMessage("Something Want wrong");
        })
    }

    EndWorkHours=(employee_id, date, end_time, day)=>{

        this.setState({loaderDIV:""})
        axios.post(onCheckOutURL(),onEndWorkBody(employee_id, date, end_time, day))
            .then((res)=>{
            this.setState({loaderDIV:"d-none"})
            if(res.status===200 && res.data.result === "pass"){
                SuccessMessage(res.data.message);
            }
            else {
                ErrorMessage(res.data.message);
            }
        }).catch((err)=>{
            this.setState({loaderDIV:"d-none"})
            ErrorMessage("Something Want wrong");
        })
    }

    render() {
        return (
            <Fragment>
                <Container>
                    <Row className="d-flex  justify-content-center mt-auto">
                        <Col className="text-center   p-3" md={4} sm={12} lg={4}>
                            <img className={this.state.PreviewSpinner+" w-50"} src={this.state.spinner}/>
                            {<canvas className="canvasClass" id="canvasID"/>}
                        </Col>




                        <Col className="text-center" md={4} sm={12} lg={4}>
                            <img id="PersonPhoto" className="preview-img" src={this.state.photoSrc}/>
                            <button onClick={()=>this.AttendancePhotoDesCal(1)} className="btn m-3 text-center btn-danger">Check In</button>
                            <button onClick={()=>this.AttendancePhotoDesCal(2)} className="btn m-3 text-center btn-danger">Check Out</button>
                        </Col>

                    </Row>


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
                </Container>
                <div className={this.state.loaderDIV}>
                    <Loader/>
                </div>
            </Fragment>
        );
    }
}

export default Attendance;
