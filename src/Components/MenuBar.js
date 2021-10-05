import React, {Component, Fragment} from 'react';
import {Link} from "react-router-dom";
import {Navbar, Nav, Container} from "react-bootstrap";
import logoImage from "../Assets/Image/chip.svg"

class MenuBar extends Component {
    render() {
        return (
            <Fragment>
                <Navbar  bg="transparent">
                    <Navbar.Brand to="">
                        <img className="nav-logo" src={logoImage}/></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Link className="nav-link nav-font"  to="/">Login</Link>
                            <Link className="nav-link nav-font"  to="/AttendancePhoto">ATTENDANCE</Link>
                            <Link className="nav-link nav-font"  to="/home">Dashboard</Link>
                           {/* <Link className="nav-link nav-font"  to="/RegistrationPhoto">REGISTRATION</Link>*/}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Fragment>
        );
    }
}

export default MenuBar;
