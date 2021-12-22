import React, {Component, Fragment} from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import {
    RequestFail,
    ErrorMessage,
    SuccessMessage,
} from "../Helper/ToastHelper";
import axios from "axios";
import Webcam from "react-webcam";
import {onEmployeeLoginUrl, onLoginBody, onListURL} from "../APIServices/APIServices";
import * as faceapi from "face-api.js";
import {Redirect} from "react-router";
import JEEFACETRANSFERAPI from "../WebGL2/jeelizFaceTransfer.module";
import spinner from "../Assets/Image/spinner.svg";
import imagePlaceholder from "../Assets/Image/imagePlaceholder.svg";
import SweetAlert from "react-bootstrap-sweetalert";
import Loader from "./Loader";


class Login extends Component {

    constructor() {
        super();
        this.state={
            loaderDIV:"d-none",
            pass:"",
            email:"",
            PreviewSpinner:"",
            spinner:spinner,
            photoSrc:imagePlaceholder,
            CameraError:false,
            Redirect:false,
            EPhoto:false,
            AttendancePhoto_descriptor:[],
            EmpList:[],
        }
        this.cameraRef=React.createRef();
    }

    componentDidMount() {
        this.OpenWebGLCamera();
        this.getEmployeeList();
        let EmpList =  JSON.parse(localStorage.getItem('list'))
        this.setState({EmpList:EmpList});
    }


    getEmployeeList=()=>{
        axios.get(onListURL()).then((res)=>{
            if(res.status===200){
                localStorage.setItem('list',JSON.stringify(res.data));
            }
        }).catch((err)=>{
            RequestFail();
        })
    }


    Login=()=>{
        let email = this.state.email;
        let password = this.state.pass;

        if (email.length === 0){
            ErrorMessage("Enter Your Email");
        }else if(password.length === 0){
          ErrorMessage("Enter Your Password")
        }else{

            this.setState({loaderDIV:""})
            axios.post(onEmployeeLoginUrl(),onLoginBody(
                email, password
            )).then((res)=>{
                this.setState({loaderDIV:"d-none"})
                if(res.status===200 && res.data.result === "pass"){
                    SuccessMessage(res.data.message);
                    sessionStorage.setItem('employee', JSON.stringify(res.data.employee) );
                    sessionStorage.setItem('login', "true");
                    sessionStorage.setItem("employeename", res.data.employee.name)
                    sessionStorage.setItem("employeeId", res.data.employee.id)
                    this.setState({Redirect: true})
                } else if(res.status===200 && res.data.result === "fail"){
                    ErrorMessage(res.data.message);
                }
            }).catch((err)=>{
                this.setState({loaderDIV:"d-none"})
                ErrorMessage("Fail to Login");
            })
        }


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
                    /*this.getFaceMovement();*/
                }
            }
        })
    }

   /* getFaceMovement=()=>{
        setInterval(()=>{
            let FaceMovement=  JEEFACETRANSFERAPI.get_morphTargetInfluences();
            if(JEEFACETRANSFERAPI.is_detected()){
                  let RightEye= FaceMovement[8];
                  let LeftEye= FaceMovement[9];
                  if(RightEye>=0.75  && LeftEye>=0.75){
                      this.onCapture();
                  }
                /!*this.onCapture();*!/
            }
        },1000)
    }*/

    onCapture=()=>{
        setTimeout(()=>{
            if(this.cameraRef.current!==null){
                let PhotoBase64= this.cameraRef.current.getScreenshot();
                this.setState({photoSrc:PhotoBase64,EPhoto:true})
            }

        },1000)
    }


    AttendancePhotoDesCal=()=>{
        if(this.state.EPhoto === false){
            ErrorMessage("Take a picture to close your eye")
        }else{
        (async ()=>{
            this.setState({loaderDIV:""})
            await  faceapi.loadSsdMobilenetv1Model('/model1');
            await  faceapi.loadFaceLandmarkModel('/model1');
            await  faceapi.loadFaceRecognitionModel('/model1');
            const img=document.getElementById('PersonPhoto')

            try {
                const imgDes= await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                this.setState({AttendancePhoto_descriptor:imgDes['descriptor']})
                this.FaceMatchingResult();
            }catch (e) {
                this.setState({loaderDIV:"d-none"})
                ErrorMessage("Take a Clear Picture")
            }

        })()

    }
    }



    FaceMatchingResult=()=>{
        let AttendancePhoto_descriptor= this.state.AttendancePhoto_descriptor;
        let EmpList=this.state.EmpList;


        for (let i = 0; i <= EmpList.length; i++) {
            let Existing_descriptor =new Float32Array(JSON.parse(EmpList[i]['photo_descriptor']))
            let distance= faceapi.euclideanDistance(AttendancePhoto_descriptor,Existing_descriptor);


                let similarity= 1-distance;
                if(similarity>=0.6){
                    this.setState({loaderDIV:"d-none"})
                    sessionStorage.setItem('employee', JSON.stringify(EmpList[i]) );
                    sessionStorage.setItem('login', "true");
                    sessionStorage.setItem("employeename", EmpList[i]['name'])
                    sessionStorage.setItem("employeeId", EmpList[i]['id'])
                    SuccessMessage("Successfully Match your face")
                    this.setState({Redirect: true})
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

    pageRedirect=()=>{
        if(this.state.Redirect === true){
            return (
                <Redirect to="/home"/>
            )
        }
    }

    render() {
        return (
            <Fragment>

                <Container className="mt-5">
                    <Row className="d-flex  justify-content-center mt-auto">
                        <Col className="text-center   p-3" md={4} sm={12} lg={4}>
                            <img className={this.state.PreviewSpinner+" w-50"} src={this.state.spinner}/>
                            {<canvas className="canvasClass" id="canvasID"/>}
                            <button onClick={this.onCapture} className="btn m-3 btn-danger">Capture</button>
                        </Col>

                        <Col className="text-center" md={4} sm={12} lg={4}>
                            <img id="PersonPhoto" className="preview-img" src={this.state.photoSrc}/>
                            <button onClick={this.AttendancePhotoDesCal} className="btn m-3 btn-danger">Login with Face</button>
                        </Col>

                        <Col className="  p-3" md={4} sm={12} lg={4}>
                            <label className="form-label text-black-50">Email</label>
                            <input onChange={(e)=>this.setState({email:e.target.value})} placeholder="Enter Email"  className="form-control" type="text"/>

                            <label className="form-label text-black-50">Password</label>
                            <input onChange={(e)=>this.setState({pass:e.target.value})} placeholder="Enter Password"  className="form-control" type="text"/>
                            <Button onClick={this.Login}  className="btn  mt-3 btn-danger btn-block">Login With Email & Password</Button>
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

                {this.pageRedirect()}
            </Fragment>
        );
    }
}

export default Login;
