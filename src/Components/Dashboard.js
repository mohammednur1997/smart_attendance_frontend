import React, {Component, Fragment} from 'react';
import {Tab, Container, Row, Col, Nav} from "react-bootstrap";
import Profile from "./DashboardComponent/Profile";
import Vacation from "./DashboardComponent/Vacation";
import Record from "./DashboardComponent/Record";

class Dashboard extends Component {
    render() {
        return (
            <Fragment>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row>
                        <Col md={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">Profile</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">Record</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="third">Vacation Request</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>

                        <Col md={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <Profile />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <Vacation />
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    <Record />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>

                    </Row>
                </Tab.Container>
            </Fragment>
        );
    }
}

export default Dashboard;
