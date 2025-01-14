import axios from "axios";



// ip cua Duc:http://192.168.129.238:8000/
 const BASE_URL="http://192.168.1.253:8000/"
//  const BASE_URL="http://192.168.129.238:8000/"
//const BASE_URL="http://192.168.1.10:8000/"



export const endpoints={
    'login': '/o/token/',
    'current-user': '/users/current-user/',
    'register':'/users/',
    'role':'/roles/',
    'address':'/addresses/',
    'getListPostWant':'/post-wants',
    'getListPostForRent':'/post-for-rents',

}
export const endpointsDuc={
    'getListNotification':'/notifications',
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