import React, {Component, Fragment} from 'react';
import Switch from "react-bootstrap/Switch";
import {Route} from "react-router";
import RegistrationPhotoCapturePage from "../Pages/RegistrationPhotoCapturePage";
import AttendancePage from "../Pages/AttendancePage";
import RegistrationInfoPage from "../Pages/RegistrationInfoPage";
import LoginPage from "../Pages/LoginPage";
import RecordPage from "../Pages/RecordPage";
import VacationPage from "../Pages/Vacation";
import EmployeeHomePage from "../Pages/EmployeeHomePage";
import LogoutPage from "../Pages/logoutPage";
import ResetPasswordPage from "../Pages/ResetPasswordPage";
import MessagePage from "../Pages/Message";

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

                    <Route exact path="/Attendance" render={(props) => <AttendancePage {...props} />}/>
                    <Route exact path="/ResetPassword" render={(props) => <ResetPasswordPage{...props} />}/>
                    <Route exact path="/Message" render={(props) => <MessagePage{...props} />}/>
                    <Route exact path="/logout" render={(props) => <LogoutPage {...props} />}/>
                </Switch>
            </Fragment>
        );
    }
}

export default AppRouting;
