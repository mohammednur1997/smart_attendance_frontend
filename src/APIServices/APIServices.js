class APIServices{

    // List
    onListURL(){
        return "https://mobileecom.azmisoft.com/api/list"
    }


    // Registration
    onRegistrationURL(){
        return "https://mobileecom.azmisoft.com/api/registration"
    }

     //AttendanceUrl
    onAttendanceURL(){
        return "http://127.0.0.1:8000/api/attendance"
    }

    onEmployeeLoginUrl(){
        return "http://127.0.0.1:8000/api/login"
    }

    onLoginBody(email,password){
        return{
            email:email,
            password:password,
        }
    }

    onRegistrationBody(name,employee_id,employee_mobile,photo_descriptor){
            return{
                name:name,
                employee_id:employee_id,
                employee_mobile:employee_mobile,
                photo_descriptor:photo_descriptor,
            }
    }

    onStartWorkBody(employee_id, date, in_time, day){
        return{
            employee_id:employee_id,
            date:date,
            in_time:in_time,
            day:day,
        }
    }

    onEndWorkBody(employee_id, date, end_time, day){
        return{
            employee_id:employee_id,
            date:date,
            out_time:end_time,
            day:day,
        }
    }

    // AttendancePhotoCapture
   /* onAttendanceURL(){
        return "https://mobileecom.azmisoft.com/api/attendance"
    }*/

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
    onAttendanceBody,
    onStartWorkBody,
    onEndWorkBody,
    onAttendanceURL,
    onEmployeeLoginUrl,
    onLoginBody
}=new APIServices();
