import React, {Component, Fragment} from 'react';
import HowWorks from "../Components/HowWorks";
import MenuBar from "../Components/MenuBar";
import axios from "axios";
import {onListURL} from "../APIServices/APIServices";
import {RequestFail} from "../Helper/ToastHelper";

class HomePage extends Component {


    componentDidMount() {
        axios.get(onListURL()).then((res)=>{
            if(res.status===200){
                localStorage.setItem('list',JSON.stringify(res.data));
            }
        }).catch((err)=>{
            RequestFail();
        })
    }

    render() {
        return (
            <Fragment>
                <MenuBar/>
                <br/>
                <HowWorks/>
            </Fragment>
        );
    }
}

export default HomePage;
