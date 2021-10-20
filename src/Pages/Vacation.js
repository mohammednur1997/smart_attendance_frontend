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
import 'react-quill/dist/quill.snow.css';

class VacationPage extends Component {

    constructor() {
        super();
        this.state ={
            DataList:[],
            isLoading:true,
            isWrong:false,
            rowDataId:"",

            title:"",
            description:"",
            feature:"",
            PreviewLink:"",
            CardImage:"",
            projectImage:"",
            modelStatus:false
        }
        this.deleteData = this.deleteData.bind(this);
        this.getDaData = this.getDaData.bind(this);
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
        this.openUpdateModal = this.openUpdateModal.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    }

    componentDidMount() {
        this.getDaData();
    }

    getDaData(){
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

    openModal(){
        this.setState({modelStatus: true})
    }

    closeModal(){
        this.setState({modelStatus: false})
    }

    openUpdateModal(event){
        this.setState({modelStatus: true})

        let rowId = this.state.rowDataId;
        if (rowId === ""){
            alert("Please select a row");
            this.setState({modelStatus: false})
        }else{
            let url = "/getProjectDataById/"+rowId;

            Axios.get(url)
                .then(response =>{
                    let data =  response.data.serviceData;
                    this.setState({
                        title:data[0]['project_title'],
                        description: data[0]['project_description'],
                        feature: data[0]['project_feature'],
                        PreviewLink: data[0]['project_preview_link'],
                        CardImage: data[0]['image_one'],
                        projectImage: data[0]['image_two'],
                    })
                })
                .catch(error =>{
                    alert(error)
                })
        }

        event.preventDefault();
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

    formSubmit(event){

        let projectTitle = this.state.title;
        let description = this.state.description;
        let feature = this.state.feature;
        let link = this.state.PreviewLink;
        let CardImage = this.state.CardImage;
        let projectImage = this.state.projectImage;

        let id  = this.state.rowDataId;

        let data = new FormData;
        data.append('id', id);
        data.append('title', projectTitle);
        data.append('des', description);
        data.append('projectFeature', feature);
        data.append('previewLink', link);
        data.append('CardImage', CardImage);
        data.append('projectImage', projectImage);

        let config = {
            headers:{
                'content-type':"multipart/form-data"
            }
        }
        let url = "/addProject";

        Axios.post(url, data, config)
            .then(response =>{
                if (response.status === 200 ){
                    toast.success('Data Save Success!', {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                    });
                    this.setState({modelStatus:false})
                    this.componentDidMount();
                }else{
                    toast.error('Fail to save data!', {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                    });
                    this.setState({modelStatus:false})
                    this.componentDidMount();
                }

            })
            .catch(error =>{
                toast.error('Fail to save data!', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            })
        event.preventDefault();
    }

    deleteData(){
        let confirmData = confirm("Are You want to Delete Data");
        if (confirmData === true){
            this.setState({buttonText: <Spinner as='span' animation='border' size='lg' role='status' aria-hidden='true'/>})
            Axios.post("/projectDelete", {id:this.state.rowDataId})
                .then((response)=>{
                    if (response.data == 1 && response.status == 200){
                        toast.success('Delete Success!', {
                            position: "bottom-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                        });
                        this.getDaData();
                    }else{
                        toast.error('Delete Fail!', {
                            position: "bottom-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                        });
                        this.getDaData();
                    }

                })
                .catch((error)=>{
                    toast.error('Delete Fail!', {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                    });
                    this.getDaData();
                })
        }
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
            /* const myData = this.state.DataList;*/
            const myData = [
                {id:1, "name":"Mohammed Nur", "Start_date":20/2/201, "End_date":1/21/2010,"reason":"For fiver", "status":"Approve"},
                {id:2, "name":"Mohammed Nur", "Start_date":20/2/201, "End_date":1/21/2010,"reason":"For fiver", "status":"Not Approve"},
                {id:3, "name":"Mohammed Nur", "Start_date":20/2/201, "End_date":1/21/2010,"reason":"For fiver", "status":"Not Approve"},
                {id:4, "name":"Mohammed Nur", "Start_date":20/2/201, "End_date":1/21/2010,"reason":"For fiver", "status":"Not Approve"},
                {id:5, "name":"Mohammed Nur", "Start_date":20/2/201, "End_date":1/21/2010,"reason":"For fiver", "status":"Approve"},
                {id:6, "name":"Mohammed Nur", "Start_date":20/2/201, "End_date":1/21/2010,"reason":"For fiver", "status":"Approve"},
            ]


            const column = [{
                dataField: 'id',
                text: 'ID'
            }, {
                dataField: 'name',
                text: 'Name'
            }, {
                dataField: 'Start_date',
                text: 'Start Date'
            },{
                    dataField: 'End_date',
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
                                <Col sm={12} md={12} lg={12}>
                                    <Card>
                                        <Card.Body>
                                            <Button onClick={this.deleteData} className="normal-btn btn my-3">Delete</Button>
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
                                    <Form.Control  type="text" placeholder="Enter Start Date" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control  type="text" placeholder="Enter End Date" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Reason</Form.Label>
                                    <ReactQuill style={{height:200}} />
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
