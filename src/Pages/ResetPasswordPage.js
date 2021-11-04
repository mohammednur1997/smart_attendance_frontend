import React, {Component, Fragment} from 'react';
import ResetPassword from "../Components/ResetPassword";
import Menu from "../Components/Menu";

class ResetPasswordPage extends Component {
    render() {
        return (
            <Fragment>
                <Menu/>
                <ResetPassword/>
            </Fragment>
        );
    }
}

export default ResetPasswordPage;
