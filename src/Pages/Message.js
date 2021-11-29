import React, {Component, Fragment} from 'react';
import Menu from "../Components/Menu";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Axios from "axios";
import {Button, Card, Col, Container, Form, Modal, Row, Spinner} from "react-bootstrap";
import {AttendanceHost, onLoginBody} from "../APIServices/APIServices";
import LoadingDiv from "../Components/loadingDiv";
import WentWrong from "../Components/wentWrong";
import 'react-toastify/dist/ReactToastify.css';
import {
    ErrorMessage,
    SuccessMessage,
} from "../Helper/ToastHelper";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactHtmlParser, {htmlparser2} from 'react-html-parser';

class MessagePage extends Component {

    constructor() {
        super();
        this.state ={
            Message:[],
            isLoading:true,
            isWrong:false,
            rowDataId:"",
            myMessage:"",
            modelStatus:false
        }
    }

    componentDidMount() {
        this.getMessage()
    }

    getMessage=()=>{
        let employee_id = sessionStorage.getItem("employeeId");
        this.setState({isLoading: true})
        Axios.get(AttendanceHost()+"/api/AllMessage/"+ employee_id)

            .then((response)=>{
                if (response.status == 200){
                    this.setState({Message:response.data.message, isLoading:false, isWrong:false})
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

    openShowModal=(event)=>{
        this.setState({modelStatus: true})
        let rowId = this.state.rowDataId;

        if (rowId === ""){
            ErrorMessage("Select a data from table")
            this.setState({modelStatus: false})
        }else{
            let url = AttendanceHost()+"/api/AllMessageByID/"+rowId;
            Axios.get(url)
                .then(response =>{
                    let data =  response.data.message;
                    this.setState({
                        myMessage: data.message,
                    })
                })
                .catch(error =>{
                    ErrorMessage(error)
                })
        }

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

            function htmlFormatter(cell) {
                return (
                    <span>{ReactHtmlParser(cell)}</span>
                );
            }

            const myData = this.state.Message;

            const column = [{
                dataField: 'message',
                text: 'Message',
                formatter: htmlFormatter
            }
            ];

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
                                            <Button onClick={this.openShowModal} className="normal-btn btn ml-2">Show</Button>
                                            <BootstrapTable keyField='id' selectRow={selectRow} data={ myData } columns={ column } pagination={ paginationFactory() } />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </Menu>
                    <Modal show={this.state.modelStatus} onHide={this.closeModal} size='lg'>
                        <Modal.Header closeButton>
                            <Modal.Title>Message</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={this.formSubmit}>
                                <Form.Group>
                                    <Form.Label>Message</Form.Label>
                                    <ReactQuill value={this.state.myMessage} onChange={this.reason} style={{height:200}} />
                                </Form.Group>

                                <br/>
                                <br/>
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

export default MessagePage;
