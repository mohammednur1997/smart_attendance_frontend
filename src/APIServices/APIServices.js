class APIServices{

    // List
    onListURL(){
        return "https://mobileecom.azmisoft.com/api/list"
    }


    // Registration
    onRegistrationURL(){
        return "https://mobileecom.azmisoft.com/api/registration"
    }

    onRegistrationBody(name,employee_id,employee_mobile,photo_descriptor){
            return{
                name:name,
                employee_id:employee_id,
                employee_mobile:employee_mobile,
                photo_descriptor:photo_descriptor,
            }
    }

    // AttendancePhotoCapture
    onAttendanceURL(){
        return "https://mobileecom.azmisoft.com/api/attendance"
    }

    onAttendanceBody(name,employee_id,employee_mobile){
        return{
            name:name,
            employee_id:employee_id,
            employee_mobile:employee_mobile,
        }
    }

}


export const {
    onListURL,
    onRegistrationURL,
    onRegistrationBody,
    onAttendanceURL,
    onAttendanceBody
}=new APIServices();
