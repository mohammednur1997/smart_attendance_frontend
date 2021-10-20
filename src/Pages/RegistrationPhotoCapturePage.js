import React, {Component,Fragment} from 'react';
import Menu from "../Components/Menu";
import RegistrationPhotoCapture from "../Components/RegistrationPhotoCapture";

class RegistrationPhotoCapturePage extends Component {
    render() {
        return (
            <Fragment>
                <Menu/>
                <br/>
                <RegistrationPhotoCapture/>
            </Fragment>
        );
    }
}

export default RegistrationPhotoCapturePage;
