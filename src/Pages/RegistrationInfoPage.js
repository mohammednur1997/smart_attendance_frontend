import React, {Component, Fragment} from 'react';
import MenuBar from "../Components/MenuBar";
import RegistrationInfo from "../Components/RegistrationInfo";

class RegistrationInfoPage extends Component {
    render() {
        return (
            <Fragment>
                <MenuBar/>
                <br/>
                <RegistrationInfo/>
            </Fragment>
        );
    }
}

export default RegistrationInfoPage;
