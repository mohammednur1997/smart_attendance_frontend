import React, {Component, Fragment} from 'react';
import Menu from "../Components/Menu";
import RegistrationInfo from "../Components/RegistrationInfo";

class RegistrationInfoPage extends Component {
    render() {
        return (
            <Fragment>
                <Menu/>
                <br/>
                <RegistrationInfo/>
            </Fragment>
        );
    }
}

export default RegistrationInfoPage;
