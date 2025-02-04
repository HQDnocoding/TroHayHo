import axios from "axios";



// ip cua Duc:http://192.168.129.238:8000/
const BASE_URL="http://192.168.1.253:8000/"
// const BASE_URL="http://192.168.1.55:8000/"
// const BASE_URL="http://192.168.1.12:8000/"
//const BASE_URL="http://192.168.103.238:8000/"
// const BASE_URL = "https://hqd2004.pythonanywhere.com/"
// const BASE_URL = "http://192.168.1.11:8000/"
// const BASE_URL = "http://192.168.1.196:8000/"



export const endpoints = {
    'login': '/o/token/',
    'current-user': '/users/current-user/',
    'add-phone-number': '/users/add-phone-number/',
    'send-otp': '/users/send-otp/',
    'check-email': '/users/check-email/',
    'verify-otp-email': '/users/verify-otp-email/',
    'verify-otp': '/users/verify-otp/',
    'change-password': '/users/change-password/',
    'follow-me': '/users/follow-me/',
    'following': '/users/following/',
    'register': '/users/',
    'register-chu-tro': '/chu-tro/',
    'google-login': '/google-login/',
    'favourite-posts': '/users/favourites/',
    'roles': '/roles/',
    'address': '/addresses/',
    'getListPostWant': '/post-wants/',
    'getListPostForRent': '/post-for-rents/',
    'image': '/images/',
    'post-for-rent-detail': (postId) => `/post-for-rents/${postId}/`,
    'post-want-detail': (postId) => `/post-wants/${postId}/`,
    'pw-comment': (postId) => `/post-wants/${postId}/comments/`,
    'pfr-comment': (postId) => `/post-for-rents/${postId}/comments/`,
    'provinces': '/provinces/',
    'provinces-districts': (provinceId) => `/provinces/${provinceId}/districts/`,
    'provinces-districts-wards': (provinceId, districtId) => `/provinces/${provinceId}/districts/${districtId}/wards/`,
    'notifications': '/notifications/',
}
export const endpointsDuc = {
    'getListPostWantShow': '/post-wants-show/',
    'getListPostForRentShow': '/post-for-rents-show/',
    'getListNotification': (userId) => `/basic-user-info/${userId}/detail-notification/`,
    'getDetailNotification': (detailNotiId) => `/detail-notification/${detailNotiId}/`,
    'getListConversationByUserId': (userId) => `/user-conversations/user/${userId}/`,
    'getListMessageByConversationId': (conversationId) => `/conversation-messages/conversation/${conversationId}/`,
    'getListPostWantByUserId': (userId) => `/user-post-wants/show/user/${userId}/`,
    'getListPostForRentByUserId': (userId) => `/user-post-for-rents/show/user/${userId}/`,
    'getListHidePostWantByUserId': (userId) => `/user-post-wants/hide/user/${userId}/`,
    'getListHidePostForRentByUserId': (userId) => `/user-post-for-rents/hide/user/${userId}/`,
    'getBasicUserInfoByUserId': (userId) => `/basic-user-info/${userId}/`,
    'getMeFavoritePost': (userId) => `/basic-user-info/${userId}/me-favorite-post/`,
    'checkMeFollowYour': (followerId, followedId) => `/basic-user-info/${followerId}/check-me-following-you/${followedId}/`,
    'updateMeFollowingYou': (followerId, followedId) => `/basic-user-info/${followerId}/update-me-following-you/${followedId}/`,
    'updateMeFavoritePost': (userId, postId) => `/basic-user-info/${userId}/update-me-favotite-post/${postId}/`,
    'getListFollowPostWant': (userId) => `/basic-user-info/${userId}/post-want-following/`,
    'getListFollowPostForRent': (userId) => `/basic-user-info/${userId}/post-for-rent-following/`,
    'getListMeFollowing': (userId) => `/basic-user-info/${userId}/following/`,
    'getListWhoFollowingMe': (userId) => `/basic-user-info/${userId}/who-following-me/`,
    'getPostParent': (postID) => `/post-parent/${postID}/`,
    'getListPostParent': `/post-parent/`,
    'updateDetailNotification': (userId, postId) => `/basic-user-info/${userId}/detail-notification/${postId}/`,
    'updateShowPost': (userId, postId) => `/basic-user-info/${userId}/update-post-manager/${postId}/`,
    'deleteSoftPost': (userId, postId) => `/basic-user-info/${userId}/delete-post-manager/${postId}/`,
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

