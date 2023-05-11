export default function getTheToken(){
    if (sessionStorage.getItem("admin_login_token") || localStorage.getItem("admin_login_token")) {

        if (sessionStorage.getItem("admin_login_token")) {
            const token = sessionStorage.getItem("admin_login_token")
            return {available:true , token : token}
        } else {
            const token = localStorage.getItem("admin_login_token")
            return {available:true , token : token}
        }
    }
    else{
        return {available:false}
    }
}

