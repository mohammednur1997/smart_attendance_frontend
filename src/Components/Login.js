import React, {Component, Fragment} from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import {
    AttendanceSuccess,
    RegistrationSuccess,
    RequestFail,
    RequiredID,
    RequiredMobile,
    RequiredName,
    ErrorMessage,
    SuccessMessage,
} from "../Helper/ToastHelper";
import axios from "axios";
import Webcam from "react-webcam";
import {onAttendanceURL, onRegistrationBody, onRegistrationURL, onStartWorkBody, onEmployeeLoginUrl, onLoginBody} from "../APIServices/APIServices";
import * as faceapi from "face-api.js";
import {Redirect} from "react-router";
import JEEFACETRANSFERAPI from "../WebGL2/jeelizFaceTransfer.module";
import spinner from "../Assets/Image/spinner.svg";
import imagePlaceholder from "../Assets/Image/imagePlaceholder.svg";
import SweetAlert from "react-bootstrap-sweetalert";

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
            Redirect:false
        }
        this.cameraRef=React.createRef();
    }

    componentDidMount() {
        this.OpenWebGLCamera();
       /* let photoSrc= sessionStorage.getItem('photoSrc');
        this.setState({photoSrc:photoSrc})*/
    }


    onLogin=()=>{
        let EName=this.state.EName;
        let Eid=this.state.Eid;
        let EMobile=this.state.EMobile;
        if(EName.length===0){
            RequiredName();
        }
        else if(Eid.length===0){
            RequiredID();
        }
        else if(EMobile.length===0){
            RequiredMobile();
        }
        else{
            this.PhotoDesCal(EName,Eid,EMobile);
        }
    }

    /*Login=()=>{

        let email = this.state.email;
        let pass = this.state.pass;

        if (pass.toString() === matchPas ){
            this.setState({
                Redirect: true
            })

        }else{
            alert("Wrong Password")
        }
    }*/

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
                    /*  RequestFail();*/
                    ErrorMessage(res.data.message);
                }
            }).catch((err)=>{
                this.setState({loaderDIV:"d-none"})
              /*  RequestFail();*/
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
                let PhotoBase64 = this.cameraRef.current.getScreenshot();
                /*sessionStorage.setItem('photoSrc',PhotoBase64);*/
                this.setState({photoSrc:PhotoBase64})
            }

        },1000)
    }



    postRegistrationData=(name,employee_id,employee_mobile,photo_descriptor)=>{
        this.setState({loaderDIV:""})
        axios.post(onRegistrationURL(),onRegistrationBody(
            name,employee_id,employee_mobile,photo_descriptor
        )).then((res)=>{
            this.setState({loaderDIV:"d-none"})
            if(res.status===200 && res.data===1){
                RegistrationSuccess();
                this.setState({ Redirect:true})
            }
            else {
                RequestFail();
            }
        }).catch((err)=>{
            this.setState({loaderDIV:"d-none"})
            RequestFail();
        })
    }


    PhotoDesCal=(name,employee_id,employee_mobile)=>{
        (async ()=>{
            this.setState({loaderDIV:""})
            await  faceapi.loadSsdMobilenetv1Model('/model1');
            await  faceapi.loadFaceLandmarkModel('/model1');
            await  faceapi.loadFaceRecognitionModel('/model1');
            const img=document.getElementById('PersonPhoto')
            const imgDes= await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
            let photo_descriptor= JSON.stringify(Array.from(imgDes['descriptor']))
            this.postRegistrationData(name,employee_id,employee_mobile,photo_descriptor)
        })()
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
                <Container>
                    <Row className="d-flex  justify-content-center">
                        <Col className="text-center   p-3" md={4} sm={12} lg={4}>
                            <img className={this.state.PreviewSpinner+" w-50"} src={this.state.spinner}/>
                            {/*<canvas className="canvasClass" id="canvasID"/>*/}
                        </Col>
                        <Col className="  p-3" md={4} sm={12} lg={4}>
                            <label className="form-label text-black-50">Email</label>
                            <input onChange={(e)=>this.setState({email:e.target.value})} placeholder="Enter Email"  className="form-control" type="text"/>

                            <label className="form-label text-black-50">Password</label>
                            <input onChange={(e)=>this.setState({pass:e.target.value})} placeholder="Enter Password"  className="form-control" type="text"/>
                            <Button onClick={this.Login}  className="btn  mt-3 btn-danger btn-block">Login</Button>
                        </Col>

                    </Row>

                </Container>
               {/* <div className={this.state.loaderDIV}>
                    <Loader/>
                </div>
                */}
                {this.pageRedirect()}
            </Fragment>
        );
    }
}

export default Login;
