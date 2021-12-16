import React, {Component,Fragment} from 'react';
import {Col, Container, Row, Button, Card} from "react-bootstrap";
import Loader from "./Loader";
import spinner from "../Assets/Image/spinner.svg";
import {SuccessMessage, ErrorMessage} from "../Helper/ToastHelper";
import axios from "axios";
import {onResetPassBody, onResetPasswordURL} from "../APIServices/APIServices";
class ResetPassword extends Component {

    constructor() {
        super();
        this.state={
            loaderDIV:"d-none",
            PreviewSpinner:"",
            spinner:spinner,
            Redirect:false,
            newPass:"",
            oldPass:""
        }
    }

    ChangePass=()=>{
        let employeeId = sessionStorage.getItem("employeeId");
        let newPass = this.state.newPass;
        let oldPass = this.state.oldPass;

        if (oldPass.length === 0){
            ErrorMessage("Enter Old Password")
        }else if(newPass.length === 0){
            ErrorMessage("Enter New Password")
        }else{
            this.setState({loaderDIV:""})
            axios.post(onResetPasswordURL(),onResetPassBody(
                employeeId, newPass,oldPass
            )).then((res)=>{
                this.setState({loaderDIV:"d-none"})

                if(res.data.result === "pass"){
                    SuccessMessage(res.data.message);
                }
                else {
                    ErrorMessage(res.data.message);
                }
            }).catch((err)=>{
                this.setState({loaderDIV:"d-none"})
                ErrorMessage("Some Want Wrong");
            })
        }

    }



    render() {
        return (
            <Fragment>
                <Container>
                    <Row className="d-flex text-center justify-content-center">
                        <Col className="p-3" md={4} sm={12} lg={4}>
                            <Card.Body>
                                <label className="form-label text-black-50">Old Password</label>
                                <input onChange={(e)=>this.setState({oldPass:e.target.value})} placeholder="Enter Your Old Password"  className="form-control" type="text"/>

                                <label className="form-label text-black-50">New Password</label>
                                <input onChange={(e)=>this.setState({newPass:e.target.value})} placeholder="Enter Your New Password"  className="form-control" type="text"/>
                                <Button onClick={this.ChangePass}  className="btn  mt-3 btn-danger btn-block">Change Password</Button>
                            </Card.Body>

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

export default ResetPassword;
