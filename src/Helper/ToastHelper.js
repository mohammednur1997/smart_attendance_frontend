import cogoToast from "cogo-toast";

class ToastHelper{

    ErrorMessage(msg){
        cogoToast.error(msg, {position:"bottom-center"})
    }

    SuccessMessage(msg){
        cogoToast.success(msg,{position:"bottom-center"})
    }

    RequiredName(){
            cogoToast.error("Employee Name Required !",{position:"bottom-center"})
    }
    RequiredPhoto(){
        cogoToast.error("Employee Photo Required !",{position:"bottom-center"})
    }
    RequiredID(){
        cogoToast.error("Employee ID Required !",{position:"bottom-center"})
    }
    InvalidID(){
        cogoToast.error("Employee ID Invalid !",{position:"bottom-center"})
    }
    RequiredMobile(){
        cogoToast.error("Employee Mobile Required !",{position:"bottom-center"})
    }
    InvalidMobile(){
        cogoToast.error("Employee Mobile Invalid !",{position:"bottom-center"})
    }

    RegistrationSuccess(){
        cogoToast.success("Successfully Scan image !",{position:"bottom-center"})
    }

    AttendanceSuccess(msg){
        cogoToast.success(msg,{position:"bottom-center"})
    }

    RequestFail(){
        cogoToast.success("Fail to take picture",{position:"bottom-center"})
    }

}

export const {
    AttendanceSuccess,
    RegistrationSuccess,
    RequestFail,
    RequiredName,
    RequiredPhoto,
    RequiredID,
    InvalidID,
    RequiredMobile,
    InvalidMobile,
    ErrorMessage,
    SuccessMessage,
}=new ToastHelper();
