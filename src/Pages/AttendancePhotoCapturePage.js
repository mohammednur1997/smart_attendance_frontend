import React, {Component,Fragment} from 'react';
import AttendancePhotoCapture from "../Components/AttendancePhotoCapture";
import Menu from "../Components/Menu";

class AttendancePhotoCapturePage extends Component {
    render() {
        return (
            <Fragment>
                <Menu/>
                <br/>
                <AttendancePhotoCapture/>
            </Fragment>
        );
    }
}

export default AttendancePhotoCapturePage;
