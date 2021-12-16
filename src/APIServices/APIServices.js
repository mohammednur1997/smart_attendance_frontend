class APIServices{

    // List
    onListURL(){
        return "http://127.0.0.1:8000/api/list"
    }

    AttendanceHost(){
        return "http://127.0.0.1:8000"
    }


    // Registration
    onRegistrationURL(){
        return "http://127.0.0.1:8000/api/registerEmployee"
    }

     //AttendanceUrl
    onCheckInURL(){
        return "http://127.0.0.1:8000/api/attendance/checkIn"
    }

    onCheckOutURL(){
        return "http://127.0.0.1:8000/api/attendance/checkOut"
    }

    onResetPasswordURL(){
        return "http://127.0.0.1:8000/api/changePass"
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

    onRegistrationBody(employee_id,photo_descriptor){
            return{
                employee_id:employee_id,
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

    onResetPassBody(employee_id, newPass, oldPass){
        return{
            employee_id:employee_id,
            newPass:newPass,
            oldPass:oldPass
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
    onLoginBody,
    AttendanceHost,
    onCheckInURL,
    onCheckOutURL,
    onResetPassBody,
    onResetPasswordURL
}=new APIServices();
