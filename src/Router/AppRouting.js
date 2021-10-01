import React, {Component, Fragment} from 'react';
import Switch from "react-bootstrap/Switch";
import {Route} from "react-router";
import HomePage from "../Pages/HomePage";
import RegistrationPhotoCapturePage from "../Pages/RegistrationPhotoCapturePage";
import AttendancePhotoCapturePage from "../Pages/AttendancePhotoCapturePage";
import RegistrationInfoPage from "../Pages/RegistrationInfoPage";
import AttendanceInfoPage from "../Pages/AttendanceInfoPage";
import LoginPage from "../Pages/LoginPage";
import DashboardPage from "../Pages/DashboardPage";
import ProjectsPage from "../Pages/ProjectsPage";

class AppRouting extends Component {
    render() {
        return (
            <Fragment>
                <Switch>
                {/*    <Route exact path="/" render={(props) => <HomePage {...props} />}/>*/}

                    <Route exact path="/" render={(props) => <LoginPage {...props} />}/>
                    <Route exact path="/Dashboard" render={(props) => <DashboardPage {...props} />}/>
                    <Route exact path="/project" render={(props) => <ProjectsPage {...props} />}/>
                    <Route exact path="/RegistrationPhoto" render={(props) => <RegistrationPhotoCapturePage {...props} />}/>
                    <Route exact path="/RegistrationInfo" render={(props) => <RegistrationInfoPage {...props} />}/>

                    <Route exact path="/AttendancePhoto" render={(props) => <AttendancePhotoCapturePage {...props} />}/>
                    <Route exact path="/AttendanceInfo" render={(props) => <AttendanceInfoPage {...props} />}/>
                </Switch>
            </Fragment>
        );
    }
}

export default AppRouting;
