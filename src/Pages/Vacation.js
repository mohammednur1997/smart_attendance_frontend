import React, {Component, Fragment} from 'react';
import Menu from "../Components/Menu";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Axios from "axios";
import {Button, Card, Col, Container, Form, Modal, Row, Spinner} from "react-bootstrap";
import {AttendanceHost, onLoginBody} from "../APIServices/APIServices";
import LoadingDiv from "../Components/loadingDiv";
import WentWrong from "../Components/wentWrong";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    ErrorMessage,
    SuccessMessage,
} from "../Helper/ToastHelper";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from "moment";

class VacationPage extends Component {

    constructor() {
        super();
        this.state ={
            Vacation:[],
            isLoading:true,
            isWrong:false,
            rowDataId:"",
            buttonText:"Delete",

            start_date:"",
            end_date:"",
            reason:"",
            modelStatus:false
        }
    }

    componentDidMount() {
       this.getVacation()
    }

    getVacation=()=>{
        let employee_id = sessionStorage.getItem("employeeId");
        this.setState({isLoading: true})
        Axios.get(AttendanceHost()+"/api/vacation/"+ employee_id)

            .then((response)=>{
                if (response.status == 200){
                    this.setState({Vacation:response.data.vacation, isLoading:false, isWrong:false})
                }else{
                    this.setState({isLoading:false, isWrong:true})
                }

            }).catch(()=>{
            this.setState({isLoading:false, isWrong:true})
        })
    }

    openModal=()=>{
        let rowId = this.state.rowDataId;
        if (rowId){
            window.location.reload();
            this.setState({modelStatus: false})
        }else{
            this.setState({modelStatus: true})
        }

    }

    closeModal=()=>{
        this.setState({modelStatus: false})
    }

    openUpdateModal=(event)=>{
        this.setState({modelStatus: true})
        let rowId = this.state.rowDataId;

        if (rowId === ""){
            ErrorMessage("Select a data from table")
            this.setState({modelStatus: false})
        }else{
            let url = AttendanceHost()+"/api/vacationByID/"+rowId;
            Axios.get(url)
                .then(response =>{
                    let data =  response.data.vacation;
                    this.setState({
                        start_date: data.start_date,
                        end_date: data.end_date,
                        reason: data.reason,
                    })
                })
                .catch(error =>{
                    ErrorMessage(error)
                })
        }

        event.preventDefault();
    }

    startDate=(event)=>{
        let start =  event.target.value;
        this.setState({start_date: start})
    }

    endDate=(event)=>{
        let end =  event.target.value;
        this.setState({end_date: end})
    }


    reason=(content, delta, source, editor)=>{
        let myContent = editor.getHTML();
        this.setState({reason: myContent})
    }

    formSubmit=(event)=>{

        let start = this.state.start_date
        let end = this.state.end_date;
        let reason = this.state.reason;
        let id  = this.state.rowDataId;
        let employee_id = sessionStorage.getItem("employeeId")

        let data = new FormData;
        data.append('id', id);
        data.append('employee_id', employee_id);
        data.append('start_date', start);
        data.append('end_date', end);
        data.append('reason', reason);

        let config = {
            headers:{
                'content-type':"multipart/form-data"
            }
        }

        let url = AttendanceHost()+"/api/vacation/store";

        Axios.post(url, data, config)
            .then(response =>{
                if (response.status === 200 && response.data.result === "pass" ){
                     SuccessMessage(response.data.message)
                    this.setState({modelStatus:false})
                    this.componentDidMount();
                }else{
                    SuccessMessage("Something Wrong!")
                    this.setState({modelStatus:false})
                    this.componentDidMount();
                }

            })
            .catch(error =>{
                SuccessMessage("Something Wrong!")
            })
        event.preventDefault();
    }

    deleteData=()=>{
        let rowId = this.state.rowDataId;
        if (rowId === ""){
            ErrorMessage("Select a data from table")
            this.setState({modelStatus: false})
        }else{
            let confirmData = confirm("Are You want to Delete Data");
            if (confirmData === true){
                this.setState({buttonText: <Spinner as='span' animation='border' size='lg' role='status' aria-hidden='true'/>})
                let url = AttendanceHost()+"/api/vacation/delete/"+this.state.rowDataId
                Axios.get(url)
                    .then((response)=>{
                        if (response.data.result === "pass" && response.status === 200){
                            SuccessMessage(response.data.message)
                            this.setState({
                                buttonText:"Delete"
                            })
                            this.getVacation();
                        }else{
                            this.setState({
                                buttonText:"Delete"
                            })
                            ErrorMessage("Something want wrong")
                            this.getVacation();
                        }

                    })
                    .catch((error)=>{
                        this.setState({
                            buttonText:"Delete"
                        })
                        ErrorMessage("Something want wrong")
                        this.getVacation();
                    })
            }
        }


    }



    render() {

        let start = moment(this.state.start_date, "DD-MM-YYYY").format("YYYY-MM-DD")
        let endDate = moment(this.state.end_date, "DD-MM-YYYY").format("YYYY-MM-DD")

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
             const myData = this.state.Vacation;

            const column = [{
                dataField: 'start_date',
                text: 'Start Date'
            },{
                    dataField: 'end_date',
                    text: 'End Date'
                },{
                dataField: 'reason',
                text: 'Reason'
            }
            ,{
                    dataField: 'status',
                    text: 'Status'
                }];

            const selectRow = {
                mode:"radio",
                onSelect:(row, isSelect, rowIndex)=>{
                    this.setState({rowDataId:row.id})
                }
            }

            return (
                <Fragment>
                    <Menu title="Project">
                        <Container fluid={true}>
                            <Row>
                                <Col sm={8} md={8} lg={8}>
                                    <Card>
                                        <Card.Body>
                                            <Button onClick={this.deleteData} className="normal-btn btn my-3">{this.state.buttonText}</Button>
                                            <Button onClick={this.openModal} className="normal-btn btn ml-2">Add New</Button>
                                            <Button onClick={this.openUpdateModal} className="normal-btn btn ml-2">Update</Button>
                                            <BootstrapTable keyField='id' selectRow={selectRow} data={ myData } columns={ column } pagination={ paginationFactory() } />
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
                            <Modal.Title>Vacation Request</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={this.formSubmit}>
                                <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control value={start}  onChange={this.startDate}  type="date" format="DD-MM-YYYY" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control value={endDate} onChange={this.endDate}  type="date" format="DD-MM-YYYY"  />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Reason</Form.Label>
                                    <ReactQuill value={this.state.reason} onChange={this.reason} style={{height:200}} />
                                </Form.Group>

                                  <br/>
                                <br/>
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

export default VacationPage;
