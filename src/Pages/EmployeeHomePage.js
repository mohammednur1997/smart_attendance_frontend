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
            Redirect:false
        }
    }

    componentDidMount() {
        this.checkLogin();
    }

    checkLogin=()=>{
        let loginCheck =  sessionStorage.getItem('login');
        if (loginCheck === "false"){
            this.setState({Redirect: true})
        }
    }


    getDaData=()=>{
        Axios.get("https://admin.azmisoft.com/api/projectList")
            .then((response)=>{
                if (response.status == 200){
                    this.setState({DataList:response.data, isLoading:false, isWrong:false})
                }else{
                    this.setState({isLoading:false, isWrong:true})
                }
            }).catch(()=>{
            this.setState({isLoading:false, isWrong:true})
        })
    }


    pageRedirect=()=>{
        if(this.state.Redirect === true){
            return (
                <Redirect to="/"/>
            )
        }
    }

    render() {
            return (
                <Fragment>
                    <Menu title="Project">
                        <Container>
                            <Row>
                                <Col className="col-md-8">
                                    <Card style={{ width: '18rem' }}>
                                        <Card.Img variant="top" src={profileImage} />
                                        <Card.Body>
                                            <Card.Title>Name: Mohammed Nur</Card.Title>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroupItem>Position: Manager</ListGroupItem>
                                            <ListGroupItem>Salary: 2500 Sar</ListGroupItem>
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
