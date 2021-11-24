import React, {Component, Fragment, useEffect} from 'react';
import AppRouting from "./Router/AppRouting";
import {HashRouter} from "react-router-dom";
import OneSignal from 'react-onesignal';

function App() {

    useEffect(() => {
        OneSignal.init({
            appId: "9575b204-f235-4427-807b-318fa992606a"
        });
    });

    return (
        <Fragment>
            <HashRouter>
                <AppRouting/>
            </HashRouter>
        </Fragment>
    );
}

export default App;
