import React, {Component, Fragment} from 'react';
import AppRouting from "./Router/AppRouting";
import {HashRouter} from "react-router-dom";

class App extends Component {
    render() {
        return (
            <Fragment>
                <HashRouter>
                    <AppRouting/>
                </HashRouter>
            </Fragment>
        );
    }
}

export default App;
