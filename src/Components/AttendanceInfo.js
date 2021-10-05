import React, {Component, Fragment} from 'react';
import { Col, Container, Row} from "react-bootstrap";
import Loader from "./Loader";
import {Redirect} from "react-router";
import * as faceapi from "face-api.js";
import axios from "axios";
import {onAttendanceBody, onAttendanceURL} from "../APIServices/APIServices";
import {AttendanceSuccess, RequestFail} from "../Helper/ToastHelper";


class AttendanceInfo extends Component {

    constructor() {
        super();
        this.state={
            loaderDIV:"d-none",
            EName:"",
            Eid:"",
            EMobile:"",
            photoSrc:"",
            Redirect:false,
            AttendancePhoto_descriptor:[],
            result:"...",
            EmpList:[],
            distance:"",
            similarity:""

        }
    }
    componentDidMount() {
        let photoSrc= sessionStorage.getItem('photoSrc');
        this.setState({photoSrc:photoSrc})
        let EmpList=  JSON.parse(localStorage.getItem('list'))
        this.setState({EmpList:EmpList});

        this.AttendancePhotoDesCal();


    }


    pageRedirect=()=>{
        if(this.state.Redirect===true){
            return (
                <Redirect to="/"/>
            )
        }
    }



    AttendancePhotoDesCal=()=>{
        (async ()=>{
            this.setState({loaderDIV:""})
            await  faceapi.loadSsdMobilenetv1Model('/model1');
            await  faceapi.loadFaceLandmarkModel('/model1');
            await  faceapi.loadFaceRecognitionModel('/model1');
            const img=document.getElementById('PersonPhoto')
            const imgDes= await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
            this.setState({AttendancePhoto_descriptor:imgDes['descriptor']})
            this.FaceMatchingResult();

        })()
    }



    FaceMatchingResult=()=>{
        let AttendancePhoto_descriptor= this.state.AttendancePhoto_descriptor;
        let EmpList=this.state.EmpList;


        for (let i = 0; i <= EmpList.length; i++) {
            let Existing_descriptor =new Float32Array(JSON.parse(EmpList[i]['photo_descriptor']))
            let distance= faceapi.euclideanDistance(AttendancePhoto_descriptor,Existing_descriptor);
            let similarity=1-distance;
            this.setState({distance:distance})
            this.setState({similarity:similarity})
            if(similarity>=0.6){
                this.setState({result:"PASS"});
                this.setState({
                    EName:EmpList[i]['name'],
                    Eid:EmpList[i]['employee_id'],
                    EMobile:EmpList[i]['employee_mobile'],
                });
                this.setState({loaderDIV:"d-none"})
                this.postAttendance(EmpList[i]['name'],EmpList[i]['employee_id'],EmpList[i]['employee_mobile'])
                break;
            }
            else {
                this.setState({result:"FAIL"})
            }
        }

    }


    postAttendance=(EName,Eid,EMobile)=>{
        axios.post(onAttendanceURL(),onAttendanceBody(EName,Eid,EMobile))
            .then((res)=>{
                if(res.status===200 && res.data===1){
                    AttendanceSuccess();
                    setTimeout( ()=>{
                        this.setState({Redirect:true})
                    },10000)
                }
                else {
                    RequestFail();
                }
            }).catch((err)=>{
            RequestFail();
        })
    }


    render() {
        return (
            <Fragment>
                <Container>
                    <Row className="d-flex  justify-content-center">
                        <Col className="text-center   p-3" md={4} sm={12} lg={4}>
                            <h6><img id="PersonPhoto" className="preview-img" src={this.state.photoSrc}/></h6>
                        </Col>
                        <Col className="text-white  p-3" md={4} sm={12} lg={4}>
                            <h4>Employee Name: {this.state.EName}</h4>
                            <h4>Employee ID: {this.state.Eid}</h4>
                            <h4>Employee Mobile: {this.state.EMobile}</h4>
                            <h4>Distance: <span className="text-danger">{this.state.distance}</span></h4>
                            <h4>Similarity: <span className="text-danger">{this.state.similarity}</span></h4>
                            <h4>Result: <span className="text-danger">{this.state.result}</span></h4>
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

export default AttendanceInfo;
