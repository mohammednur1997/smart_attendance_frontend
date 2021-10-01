import React, {Component, Fragment} from 'react';
import MenuBar from "../Components/MenuBar";
import AttendanceInfo from "../Components/AttendanceInfo";


class AttendanceInfoPage extends Component {
    render() {
        return (
            <Fragment>
                <MenuBar/>
                <br/>
                <AttendanceInfo/>
            </Fragment>
        );
    }
}

export default AttendanceInfoPage;
