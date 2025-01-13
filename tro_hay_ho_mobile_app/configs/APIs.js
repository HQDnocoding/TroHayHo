import axios from "axios";



// ip cua Duc:http://192.168.129.238:8000/
// const BASE_URL="http://192.168.129.238:8000/"
const BASE_URL="http://192.168.1.10:8000/"



export const endpoints={
    'login': '/o/token/',
    'current-user': '/users/current-user/',
    'register':'/users/',
    'role':'/roles/',
    'address':'/addresses/'

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