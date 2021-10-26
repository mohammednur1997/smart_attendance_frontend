import React, {Component, Fragment} from 'react';
import Menu from "../Components/Menu";
import Axios from "axios";
import {Card, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import profileImage from "../Assets/Image/imagePlaceholder.svg";
import {Redirect} from "react-router";

class EmployeeHomePage extends Component {

    constructor() {
        super();
        this.state ={
            isLoading:true,
            isWrong:false,
            Redirect:false,
            gender:'',
            avater: profileImage
        }
    }

    componentDidMount() {
        this.checkLogin();

        let employeeData =JSON.parse(sessionStorage.getItem("employee"))
        let employeeImage = employeeData["image"];
        if (employeeImage){
            this.setState({
                avater:  "http://127.0.0.1:8000/image/employee/"+employeeImage
            })
        }
    }

    checkLogin=()=>{
        let loginCheck =  sessionStorage.getItem('login');
        if (loginCheck === "false"){
            this.setState({Redirect: true})
        }
    }


    pageRedirect=()=>{
        if(this.state.Redirect === true){
            return (
                <Redirect to="/"/>
            )
        }
    }

    render() {
        let employeeData =JSON.parse(sessionStorage.getItem("employee"))
            let employeeImage = employeeData["image"];
            let employeeName = employeeData['name'];
            let employeePosition = employeeData['job_position'];
            let employeeSalary= employeeData['salary'];
            let gender= employeeData['gender'];
            let birthday= employeeData['birthday'];
            let email = employeeData['email'];
            let joinDate = employeeData['join_date'];


            return (
                <Fragment>
                    <Menu title="Project">
                        <Container>
                            <Row>
                                <Col className="col-md-8">
                                    <Card style={{ width: '18rem' }}>
                                        <Card.Img variant="top" src={ this.state.avater } width="500" />
                                        <Card.Body>
                                            <Card.Title>Name: {employeeName}</Card.Title>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroupItem>Position: {employeePosition}</ListGroupItem>
                                            <ListGroupItem>Salary: {employeeSalary}</ListGroupItem>
                                            <ListGroupItem>Gender: {gender}</ListGroupItem>
                                            <ListGroupItem>BirthDay: {birthday}</ListGroupItem>
                                            <ListGroupItem>Email: {email}</ListGroupItem>
                                            <ListGroupItem>Join Date: {joinDate}</ListGroupItem>
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </Menu>
                    {this.pageRedirect()}
                </Fragment>
            );
        }
}

export default EmployeeHomePage;
