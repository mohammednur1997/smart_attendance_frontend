import React, {Component,Fragment} from 'react';
import MenuBar from "../Components/MenuBar";
import AttendancePhotoCapture from "../Components/AttendancePhotoCapture";

class AttendancePhotoCapturePage extends Component {
    render() {
        return (
            <Fragment>
                <MenuBar/>
                <br/>
                <AttendancePhotoCapture/>
            </Fragment>
        );
    }
}

export default AttendancePhotoCapturePage;