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
