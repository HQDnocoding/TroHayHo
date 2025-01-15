import axios from "axios";



 const BASE_URL="http://10.100.60.24:8000/"
//  const BASE_URL="http://192.168.1.253:8000/"
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
    'post-for-rent-detail':(postId)=>`/post-for-rents/${postId}/`,

}
export const endpointsDuc={
    'getListNotification':'/notifications',
    'getListConversationByUserId':(userId)=>`/user-conversations/user/${userId}/`,
    'getListMessageByConversationId':(conversationId)=>`/conversation-messages/conversation/${conversationId}/`,
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