import React, {Component, Fragment} from 'react';
import {Redirect} from "react-router";

class LogoutPage extends Component {

    constructor() {
        super();
        this.state = {
            Redirect : false
        }
    }

    componentDidMount() {
        this.logout();
    }

    logout=()=>{
        sessionStorage.setItem("login", "false")
        sessionStorage.setItem("employee", null)
        this.setState({Redirect: true})
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
                {this.pageRedirect()}
            </Fragment>
        );
    }
}

export default LogoutPage;
