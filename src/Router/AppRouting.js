import React, {Component, Fragment} from 'react';
import Switch from "react-bootstrap/Switch";
import {Route} from "react-router";
import RegistrationPhotoCapturePage from "../Pages/RegistrationPhotoCapturePage";
import AttendancePhotoCapturePage from "../Pages/AttendancePhotoCapturePage";
import RegistrationInfoPage from "../Pages/RegistrationInfoPage";
import AttendanceInfoPage from "../Pages/AttendanceInfoPage";
import LoginPage from "../Pages/LoginPage";
import RecordPage from "../Pages/RecordPage";
import VacationPage from "../Pages/Vacation";
import EmployeeHomePage from "../Pages/EmployeeHomePage";
import LogoutPage from "../Pages/logoutPage";

class AppRouting extends Component {
    render() {
        return (
            <Fragment>
                <Switch>
                    <Route exact path="/" render={(props) => <LoginPage {...props} />}/>
                    <Route exact path="/home" render={(props) => <EmployeeHomePage {...props} />}/>
                    <Route exact path="/record" render={(props) => <RecordPage {...props} />}/>
                    <Route exact path="/vacation" render={(props) => <VacationPage {...props} />}/>
                    <Route exact path="/RegistrationPhoto" render={(props) => <RegistrationPhotoCapturePage {...props} />}/>
                    <Route exact path="/RegistrationInfo" render={(props) => <RegistrationInfoPage {...props} />}/>

                    <Route exact path="/AttendancePhoto" render={(props) => <AttendancePhotoCapturePage {...props} />}/>
                    <Route exact path="/AttendanceInfo" render={(props) => <AttendanceInfoPage {...props} />}/>
                    <Route exact path="/logout" render={(props) => <LogoutPage {...props} />}/>
                </Switch>
            </Fragment>
        );
    }
}

export default AppRouting;
