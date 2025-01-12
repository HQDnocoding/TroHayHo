import axios from "axios";




const BASE_URL="http://192.168.1.10:8000/"

export const endpoints={
    'login': '/o/token/',
    'current-user': '/users/current-user/',
    'register':'/users/',
    'role':'/roles/'
}


export const authAPIs=(token)=>{
    console.info("Authenticate");
    console.info(token);
    return axios.create({
        baseURL:BASE_URL,
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })
}


export default axios.create({
    baseURL:BASE_URL,
});