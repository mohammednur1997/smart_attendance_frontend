import React, {Component, Fragment} from 'react';
import Menu from "../Components/Menu";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Axios from "axios";
import {Button, Card, Col, Container, Form, Modal, Row, Spinner} from "react-bootstrap";
import {
    ErrorMessage,
    SuccessMessage,
} from "../Helper/ToastHelper";
import LoadingDiv from "../Components/loadingDiv";
import WentWrong from "../Components/wentWrong";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import moment from "moment";
import {AttendanceHost} from "../APIServices/APIServices";
import filterFactory, { selectFilter, dateFilter  } from 'react-bootstrap-table2-filter';

class RecordPage extends Component {

    constructor() {
        super();
        this.state ={
            isLoading:true,
            isWrong:false,
            modelStatus:false,

            reward: "",
            deduction: "",
            salary_status: "UnPaid",
            attendance:[],
            emId:"",
            status:"",
            getDate:"",
            present:""

        }
    }

    componentDidMount() {
        this.getAttendance();
        this.getDataByDate();
    }

    getAttendance=()=>{
        let employee_id = sessionStorage.getItem("employeeId");

         this.setState({isLoading: true})
        Axios.get("http://127.0.0.1:8000/api/GetAttendanceById/"+ employee_id)
            .then((response)=>{
                if (response.status === 200 && response.data.result === "pass"){
                    this.setState({attendance:response.data.attendance, isLoading:false, isWrong:false})
                }else if(response.status === 200 && response.data.attendance == null){
                    SuccessMessage("Welcome to your first Office")
                }else{
                    SuccessMessage("Welcome to your first Office")
                    /*this.setState({isLoading:false, isWrong:true})*/
                }

            }).catch(()=>{
            SuccessMessage("Welcome to your first Office")
            /*this.setState({isLoading:false, isWrong:true})*/
        })
    }

    getDataByDate=()=>{
        let employee_id = sessionStorage.getItem("employeeId");
        this.setState({isLoading: true})
        Axios.get("http://127.0.0.1:8000/api/getDataByDate/"+ employee_id)
            .then((response)=>{
                if (response.status == 200){
                    if (response.data.salary.length === 0){
                        this.setState({
                            reward:response.data.reward,
                            deduction:response.data.deduction,
                            salary_status:"Unpaid",
                            isWrong:false
                        })
                    }else {
                        this.setState({
                            reward:response.data.reward,
                            deduction:response.data.deduction,
                            salary_status:response.data.salary,
                            isWrong:false
                        })
                    }
                }else{
                    SuccessMessage("Welcome to your first Office")
                    /*this.setState({isLoading:false, isWrong:true})*/
                }

            }).catch(()=>{
            SuccessMessage("Welcome to your first Office")
            /*this.setState({isLoading:false, isWrong:true})*/
        })
    }



    openModal=()=>{
        this.setState({modelStatus: true})
    }

    closeModal=()=>{
        this.setState({modelStatus: false})
    }

    getDate=(event)=>{
        let date = event.target.value;
        this.setState({getDate: date})
    }

    present=(event)=>{
        let present = event.target.value;
        this.setState({present: present})
    }

    search=(event)=>{
        let date = this.state.getDate;
        let present = this.state.present;
        let employee_id = sessionStorage.getItem("employeeId")

        let data = new FormData;
        data.append('date', date);
        data.append('employee_id', employee_id);
        data.append('present', present);
        let config = {
            headers:{
                'content-type':"multipart/form-data"
            }
        }

        let url = AttendanceHost()+"/api/search/front";
        this.setState({
            isLoading:true
        })
        Axios.post(url, data, config)
            .then(response =>{
                if (response.status === 200){
                    this.setState({attendance:response.data.record, isLoading:false, isWrong:false})
                  /*  this.componentDidMount();*/
                }else{
                    this.setState({isLoading:false})
                    SuccessMessage("Something Wrong!")
                 /*   this.componentDidMount();*/
                }

            })
            .catch(error =>{
                this.setState({isLoading:false})
                SuccessMessage("Something Wrong!")
            })
        event.preventDefault();


    }



    render() {
        if (this.state.isLoading == true){
            return(
                <Menu>
                    <Container>
                        <LoadingDiv/>
                    </Container>
                </Menu>
            );

        }else if(this.state.isWrong == true){
            return(
                <Menu>
                    <Container>
                        <WentWrong/>
                    </Container>
                </Menu>
            );
        }else{
            let today =  moment().format("YYYY-MM-DD")


            let getSalary = JSON.parse(sessionStorage.getItem("employee"));
            let salary = getSalary['salary']



             const myData = this.state.attendance;
            const selectOptions = {
                "present": 'present',
                "absence": 'absence',
            };

            const selectOptions1 = {
                "yes": 'yes',
                "no": 'no',
            };


            const column = [{
                dataField: 'present_status',
                text: 'Present Status',
                formatter: cell => selectOptions[cell],
                filter: selectFilter({
                    options: selectOptions,
                })
            },{
                dataField: 'late',
                text: 'Late',
                formatter: cell => selectOptions1[cell],
                filter: selectFilter({
                    options: selectOptions1,
                })
            }
            ,{
                dataField: 'check_in',
                text: 'Check In'
            },{
                    dataField: 'check_out',
                    text: 'Check Out'
                },{
                dataField: 'day',
                text: 'Day'
              },{
                    dataField: 'date',
                    text: 'Date',
                    filter: dateFilter()
                }
                ];


            return (
                <Fragment>
                    <Menu title="Project">
                        <Container fluid={true}>

                           {/* <Row className="mb-2">
                                <Col sm={4} md={4} lg={4}>
                                    <select onChange={this.getDate} className="form-control">
                                        <option value={today}>Today</option>
                                        <option value="month">This Month</option>
                                    </select>
                                </Col>

                                <Col sm={4} md={4} lg={4}>
                                    <select onChange={this.present} className="form-control">
                                        <option value="present">Present</option>
                                        <option value="absence">Absence</option>
                                    </select>
                                </Col>

                                <Col sm={2} md={2} lg={2}>
                                    <Button variant="primary" onClick={this.search} type="submit">
                                        Search
                                    </Button>
                                </Col>

                            </Row>*/}

                            <Row className="mb-2">
                                <Col sm={3} md={3} lg={3}>
                                    <Card className="bg-white text-black p-4">
                                            <Card.Title>{salary}</Card.Title>
                                            <Card.Text>Net Salary</Card.Text>
                                    </Card>
                                </Col>

                                <Col sm={3} md={3} lg={3}>
                                    <Card className="bg-white text-black p-4">
                                        <Card.Title>{Number(salary) + Number(this.state.reward)}</Card.Title>
                                        <Card.Text>Gross Salary</Card.Text>
                                    </Card>
                                </Col>

                                <Col sm={3} md={3} lg={3}>
                                    <Card className="bg-white text-black p-4">
                                        <Card.Title>{Number(this.state.deduction)}</Card.Title>
                                        <Card.Text>Deduction</Card.Text>
                                    </Card>
                                </Col>

                                <Col sm={3} md={3} lg={3}>
                                    <Card className="bg-white text-black p-4">
                                        <Card.Title>{this.state.salary_status}</Card.Title>
                                        <Card.Text>Salary Status</Card.Text>
                                    </Card>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12} md={12} lg={12}>
                                    <Card>
                                        <Card.Body>
                                            <BootstrapTable footerTitle={true} keyField='id'  data={ myData } columns={ column } filter={ filterFactory() } pagination={ paginationFactory() } noDataIndication="No Data Found" />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                        </Container>
                    </Menu>
                    <Modal show={this.state.modelStatus} onHide={this.closeModal} size='lg'>
                        <Modal.Header closeButton>
                            <Modal.Title>Project</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={this.formSubmit}>
                                <Form.Group>
                                    <Form.Label>Project Title</Form.Label>
                                    <Form.Control onChange={this.projectTitle} value={this.state.title} type="text" placeholder="Enter Project title" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Project Description</Form.Label>
                                    <ReactQuill style={{height:200}} value={this.state.description}  onChange={this.projectDes}/>
                                </Form.Group>


                                <Form.Group style={{marginTop:47}}>
                                    <Form.Label>Project Feature</Form.Label>
                                    <ReactQuill style={{height:200}} value={this.state.feature} onChange={this.projectFeature}/>
                                </Form.Group>

                                <Form.Group style={{marginTop:47}}>
                                    <Form.Label>Project Preview Link</Form.Label>
                                    <Form.Control onChange={this.projectPreviewLink} value={this.state.PreviewLink} type="text" placeholder="Enter Preview Link" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Card Image</Form.Label>
                                    <Form.Control onChange={this.projectCardImage} type="file"/>
                                    <img width="100" src={this.state.CardImage} alt="No Image"/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Project Image</Form.Label>
                                    <Form.Control onChange={this.projectImage} type="file" />
                                    <img width="100" src={this.state.projectImage} alt="No Image"/>
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.closeModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Fragment>
            );
        }
    }
}

export default RecordPage;
