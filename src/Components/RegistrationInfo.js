import React, {Component, Fragment} from 'react';
import Loader from "./Loader";
import {RegistrationSuccess, RequestFail, RequiredID, RequiredMobile, RequiredName} from "../Helper/ToastHelper";
import * as faceapi from "face-api.js";
import {Button, Col, Container, Row} from "react-bootstrap";
import axios from "axios";
import {onRegistrationBody, onRegistrationURL} from "../APIServices/APIServices";
import {Redirect} from "react-router";

class RegistrationInfo extends Component {

    constructor() {
        super();
        this.state={
            loaderDIV:"d-none",
            EName:"",
            Eid:"",
            EMobile:"",
            photoSrc:"",
            Redirect:false
        }
    }

    /*componentDidMount() {
        let photoSrc= sessionStorage.getItem('photoSrc');
        this.setState({photoSrc:photoSrc})
    }*/


    onRegistration=()=>{
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
            const img = document.getElementById('PersonPhoto')
            const imgDes= await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
            let photo_descriptor= JSON.stringify(Array.from(imgDes['descriptor']))
            this.postRegistrationData(name,employee_id,employee_mobile,photo_descriptor)
        })()
    }


    pageRedirect=()=>{
        if(this.state.Redirect===true){
            return (
                <Redirect to="/"/>
            )
        }
    }

    render() {
        return (
            <Fragment>
                <Container>
                    <Row className="d-flex  justify-content-center">
                        <Col className="text-center   p-3" md={4} sm={12} lg={4}>
                            <h6><img id="PersonPhoto" className="preview-img" src={this.state.photoSrc}/></h6>
                        </Col>
                        <Col className="p-3" md={4} sm={12} lg={4}>
                            <label className="form-label text-white">Employee Name </label>
                            <input onChange={(e)=>this.setState({EName:e.target.value})}  className="form-control" type="text"/>
                            <label className="form-label text-white">Employee ID</label>
                            <input onChange={(e)=>this.setState({Eid:e.target.value})}  className="form-control" type="text"/>
                            <label className="form-label text-white">Employee Mobile</label>
                            <input onChange={(e)=>this.setState({EMobile:e.target.value})}  className="form-control" type="text"/>
                            <Button onClick={this.onRegistration}  className="btn  mt-3 btn-danger btn-block">Complete</Button>
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

export default RegistrationInfo;
