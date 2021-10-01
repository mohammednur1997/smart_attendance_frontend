import React, {Component, Fragment} from 'react';
import Dashboard from "../Components/Dashboard";
import MenuBar from "../Components/MenuBar";

class DashboardPage extends Component {
    render() {
        return (
            <Fragment>
                <MenuBar/>
                <br/>
                <Dashboard />
            </Fragment>
        );
    }
}

export default DashboardPage;
