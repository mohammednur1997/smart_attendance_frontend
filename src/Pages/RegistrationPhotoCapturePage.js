import React, {Component,Fragment} from 'react';
import MenuBar from "../Components/MenuBar";
import RegistrationPhotoCapture from "../Components/RegistrationPhotoCapture";

class RegistrationPhotoCapturePage extends Component {
    render() {
        return (
            <Fragment>
                <MenuBar/>
                <br/>
                <RegistrationPhotoCapture/>
            </Fragment>
        );
    }
}

export default RegistrationPhotoCapturePage;
