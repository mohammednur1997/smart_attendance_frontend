import React, {Component, Fragment} from 'react';
import Menu from "../Components/Menu";
import AttendanceInfo from "../Components/AttendanceInfo";


class AttendanceInfoPage extends Component {
    render() {
        return (
            <Fragment>
                <Menu/>
                <br/>
                <AttendanceInfo/>
            </Fragment>
        );
    }
}

export default AttendanceInfoPage;
