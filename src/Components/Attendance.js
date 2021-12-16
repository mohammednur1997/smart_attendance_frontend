import React, {Component,Fragment} from 'react';
import { Col, Container, Row, Form} from "react-bootstrap";
import Loader from "./Loader";
import spinner from "../Assets/Image/spinner.svg";
import imagePlaceholder from "../Assets/Image/imagePlaceholder.svg";
import {SuccessMessage, ErrorMessage} from "../Helper/ToastHelper";
import moment from "moment";
import axios from "axios";
import {onStartWorkBody, onCheckInURL,onCheckOutURL, onEndWorkBody} from "../APIServices/APIServices";
class Attendance extends Component {

    constructor() {
        super();
        this.state={
            loaderDIV:"d-none",
            PreviewSpinner:"",
            spinner:spinner,
            Redirect:false,
            atten:""
        }
    }

        getAttendance=()=>{
           let employeeId = sessionStorage.getItem("employeeId");
           let day = moment().format('dddd');
           let start_time = moment().format('h:mm a');
           let end_time = moment().format(' h:mm a');
            let date  = moment().format('YYYY-MM-DD');

           if(this.state.atten === "1"){
               this.startWorkHours(employeeId, date, start_time, day);
           }else if(this.state.atten === "2"){
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
                    <Row className="d-flex text-center justify-content-center">
                        <Col className="p-3" md={4} sm={12} lg={4}>
                                    <Form.Label>Select option</Form.Label>
                                    <Form.Control
                                        as="select"
                                        onChange={(e)=>this.setState({atten:e.target.value})}
                                    >
                                        <option value="0">Choose One</option>
                                        <option value="1">Check In</option>
                                        <option value="2">Check Out</option>
                                    </Form.Control>
                                    <button onClick={this.getAttendance} className="btn m-3 text-center btn-danger">Get Attendance</button>
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
