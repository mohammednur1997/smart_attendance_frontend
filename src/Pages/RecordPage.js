import React, {Component, Fragment} from 'react';
import Menu from "../Components/Menu";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Axios from "axios";
import {Button, Card, Col, Container, Form, Modal, Row, Spinner} from "react-bootstrap";
import LoadingDiv from "../Components/loadingDiv";
import WentWrong from "../Components/wentWrong";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';

class RecordPage extends Component {

    constructor() {
        super();
        this.state ={
            EmployeeData:[],
            isLoading:true,
            isWrong:false,
            rowDataId:"",

            title:"",
            description:"",
            feature:"",
            PreviewLink:"",
            CardImage:"",
            projectImage:"",
            modelStatus:false,

            salary:"UnDefine",
            reward: "UnDefine",
            deduction: "UnDefine",
            salary_status: "UnDefine",
            attendance:[],
            emId:""


        }

        this.imageRender = this.imageRender.bind(this);
        this.imageRenderPro = this.imageRenderPro.bind(this);

        this.projectTitle = this.projectTitle.bind(this);
        this.projectDes = this.projectDes.bind(this);
        this.projectFeature = this.projectFeature.bind(this);
        this.projectPreviewLink = this.projectPreviewLink.bind(this);
        this.projectCardImage = this.projectCardImage.bind(this);
        this.projectImage = this.projectImage.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    componentDidMount() {
        this.getAttendance();
        this.getDataByDate();
    }

    getAttendance(){
        let employee_id = sessionStorage.getItem("employeeId");

         this.setState({isLoading: true})
        Axios.get("http://127.0.0.1:8000/api/GetAttendanceById/"+ employee_id)

            .then((response)=>{
                console.log(response.data.attendance)
                if (response.status == 200){
                    this.setState({attendance:response.data.attendance, isLoading:false, isWrong:false})
                }else{
                    this.setState({isLoading:false, isWrong:true})
                }

            }).catch(()=>{
            this.setState({isLoading:false, isWrong:true})
        })
    }

    getDataByDate(){
        let employee_id = sessionStorage.getItem("employeeId");
        this.setState({isLoading: true})
        Axios.get("http://127.0.0.1:8000/api/getDataByDate/"+ employee_id)
            .then((response)=>{
                if (response.status == 200){
                    this.setState({
                        EmployeeData:response.data.EmployeeData,
                        salary:response.data.EmployeeData.salary,
                        reward:response.data.EmployeeData.re_amount,
                        deduction:response.data.EmployeeData.dd_amount,
                        salary_status:response.data.EmployeeData.salary_status,
                        isWrong:false
                    })
                }else{
                    this.setState({isLoading:false, isWrong:true})
                }

            }).catch(()=>{
            this.setState({isLoading:false, isWrong:true})
        })
    }



    openModal(){
        this.setState({modelStatus: true})
    }

    closeModal(){
        this.setState({modelStatus: false})
    }

    projectTitle(event){
        let title =  event.target.value;
        this.setState({title: title})
    }

    projectDes(content, delta, source, editor){
        let myContent = editor.getText();
        this.setState({description: myContent})
    }

    projectFeature(content, delta, source, editor){
        let myContent = editor.getHTML();
        this.setState({feature: myContent})
    }

    projectPreviewLink(event){
        let link =  event.target.value;
        this.setState({PreviewLink: link})
    }

    projectCardImage(event){
        let CardPhoto =  event.target.files[0];
        this.setState({CardImage: CardPhoto})
    }

    projectImage(event){
        let proPhoto =  event.target.files[0];
        this.setState({projectImage: proPhoto})
    }



    imageRender(cell, row){
        return <img className="table-cell-img" src={cell} alt="No Image"/>
    }
    imageRenderPro(cell, row){
        return <img className="table-cell-img" src={cell} alt="No Image"/>
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
             const myData = this.state.attendance;
            const column = [{
                dataField: 'present_status',
                text: 'Present Status'
            },{
                dataField: 'late',
                text: 'Late'
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
                    text: 'Date'
                }
                ];

         /*   const selectRow = {
                mode:"radio",
                onSelect:(row, isSelect, rowIndex)=>{
                    this.setState({rowDataId:row.id})
                }
            }*/

            return (
                <Fragment>
                    <Menu title="Project">
                        <Container fluid={true}>

                            <Row className="mb-2">
                                <Col sm={4} md={4} lg={4}>
                                    <select className="form-control">
                                        <option value="A">Today</option>
                                        <option value="B">This Month</option>
                                    </select>
                                </Col>

                                <Col sm={4} md={4} lg={4}>
                                    <select className="form-control">
                                        <option value="A">Present</option>
                                        <option value="B">Absence</option>
                                    </select>
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col sm={3} md={3} lg={3}>
                                    <Card className="bg-white text-black p-4">
                                            <Card.Title>{this.state.salary}</Card.Title>
                                            <Card.Text>Net Salary</Card.Text>
                                    </Card>
                                </Col>

                                <Col sm={3} md={3} lg={3}>
                                    <Card className="bg-white text-black p-4">
                                        <Card.Title>{Number(this.state.salary) + Number(this.state.reward)}</Card.Title>
                                        <Card.Text>Gross Salary</Card.Text>
                                    </Card>
                                </Col>

                                <Col sm={3} md={3} lg={3}>
                                    <Card className="bg-white text-black p-4">
                                        <Card.Title>{this.state.deduction}</Card.Title>
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
                                            <BootstrapTable footerTitle={true} keyField='id'  data={ myData } columns={ column } pagination={ paginationFactory() } />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <ToastContainer
                                position="bottom-center"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss={false}
                                draggable={false}
                                pauseOnHover={false}
                            />
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
