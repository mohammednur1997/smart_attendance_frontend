import React, {Component, Fragment} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import { Player ,BigPlayButton } from 'video-react';
import howWork from "../Assets/video/howitworks.mp4"
class HowWorks extends Component {
    render() {
        return (
            <Fragment>
                <Container>
                    <Row>
                        <Col  className="p-2 text-white" md={6} lg={6} sm={12}>
                            <h4>How Smart Attendance System Works</h4>
                            <ul>
                                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's </li>
                                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's </li>
                                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's </li>
                                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's </li>
                                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's </li>
                                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's </li>
                            </ul>
                        </Col>
                        <Col  className="p-2" md={6} lg={6} sm={12}>
                            <Player autoPlay={false}>
                                <source src={howWork} />
                                <BigPlayButton position="center" />
                            </Player>
                        </Col>
                    </Row>
                </Container>

            </Fragment>
        );
    }
}

export default HowWorks;
