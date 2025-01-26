import axios from "axios";



// ip cua Duc:http://192.168.129.238:8000/
const BASE_URL="http://192.168.1.253:8000/"
// const BASE_URL="http://192.168.1.55:8000/"
// const BASE_URL="http://192.168.1.12:8000/"
//const BASE_URL="http://192.168.103.238:8000/"
// const BASE_URL = "http://192.168.1.10:8000/"
// const BASE_URL = "http://192.168.1.196:8000/"



export const endpoints = {
    'login': '/o/token/',
    'current-user': '/users/current-user/',
    'register': '/users/',
    'google-login': '/google-login/',
    'favourite-posts': '/users/favorites/',
    'role': '/roles/',
    'address': '/addresses/',
    'getListPostWant': '/post-wants/',
    'getListPostForRent': '/post-for-rents/',
    'post-for-rent-detail': (postId) => `/post-for-rents/${postId}/`,
    'post-want-detail': (postId) => `/post-wants/${postId}/`,
    'pw-comment': (postId) => `/post-wants/${postId}/comments/`,
    'pfr-comment': (postId) => `/post-for-rents/${postId}/comments/`,

}
export const endpointsDuc = {
    'getListNotification': (userId) => `/basic-user-info/${userId}/detail-notification/`,
    'getListConversationByUserId': (userId) => `/user-conversations/user/${userId}/`,
    'getListMessageByConversationId': (conversationId) => `/conversation-messages/conversation/${conversationId}/`,
    'getListPostWantByUserId': (userId) => `/user-post-wants/user/${userId}/`,
    'getListPostForRentByUserId': (userId) => `/user-post-for-rents/user/${userId}/`,
    'getBasicUserInfoByUserId': (userId) => `/basic-user-info/${userId}/`,
    'checkMeFollowYour': (followerId,followedId) => `/basic-user-info/${followerId}/check-me-following-you/${followedId}/`,  
    'updateMeFollowingYou': (followerId,followedId) => `/basic-user-info/${followerId}/update-me-following-you/${followedId}/`,
}

export const authAPIs = (token) => {
    console.info("Authenticate");
    console.info(token);
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}


export default axios.create({
    baseURL: BASE_URL,
});


async function loginWithIdToken(idToken) {
    try {
        const response = await axios.post(`${BASE_URL}verify-token/`, { idToken });
        console.log(response.data); // Xử lý access_token và thông tin người dùng
    } catch (error) {
        console.error('Login failed:', error);
    }
}

