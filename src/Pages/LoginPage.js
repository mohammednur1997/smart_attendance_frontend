import React, {Component, Fragment} from 'react';
import Login from "../Components/Login";
import MenuBar from "../Components/MenuBar";

class LoginPage extends Component {


    render() {
        return (
            <Fragment>
                <MenuBar/>
                <br/>
              <Login/>
            </Fragment>
        );
    }
}

export default LoginPage;
