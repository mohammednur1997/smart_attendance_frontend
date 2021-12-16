import React, {Component,Fragment} from 'react';
import Attendance from "../Components/Attendance";
import Menu from "../Components/Menu";

class AttendancePage extends Component {
    render() {
        return (
            <Fragment>
                <Menu/>
                <br/>
                <Attendance/>
            </Fragment>
        );
    }
}

export default AttendancePage;
