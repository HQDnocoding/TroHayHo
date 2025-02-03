import { db } from "../configs/FirebaseConfig"
import { onValue, ref, set, push, off, update, get, serverTimestamp,orderByChild,limitToLast,query } from "firebase/database"

const createUser = async (user) => {
    const userRef = ref(db, "users/" + `${user.id}`);
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
        return snapshot.val()
    }
    await set(userRef, {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "avatar": user.avatar,
    })
    return user.id

}
const createConversationId=(userId1,userId2)=>{
    const idKey = [userId1, userId2].sort().join("_")
    return idKey
}
const createConversation = async (userId1, userId2) => {
    // tao conversation theo danh user1_user2 de truy xuat nhanh hon
    const idKey = [userId1, userId2].sort().join("_")
    const conversationRef = ref(db, "conversations/" + idKey)

    //kiem tra co ton ton conversation giua 2 user nay chua
    const snapshot = await get(conversationRef)
    if (snapshot.exists()) {
        return snapshot.val()
    }
    await set(conversationRef, {
        "participants": {
            "user_1": userId1,
            "user_2": userId2,
        },
        "created_at": serverTimestamp(),
        "updated_at": serverTimestamp(),
        "active": true

    })
    const user1Ref = ref(db, `users/${userId1}/conversations`)
    await update(user1Ref, {
        [`${idKey}`]: serverTimestamp()
    })
    const user2Ref = ref(db, `users/${userId2}/conversations`)
    await update(user2Ref, {
        [`${idKey}`]: serverTimestamp()
    })

    return idKey


}
const createTextMessage = async (conversationId, userIdsend, textMessage) => {
    const messageRef = push(ref(db, `messages/${conversationId}`))
    const messageId = messageRef.key
    const message = {
        "text": textMessage,
        "sender_id": userIdsend,
        "created_at": serverTimestamp(),
        "type": "text"
    }
    //tao message moi
    await set(messageRef, message)
    //update lai last message
    const conversationLastMessRef = ref(db, `conversations/${conversationId}/last_message`)
    await update(conversationLastMessRef, message)

    const conversationTimeRef = ref(db, `conversations/${conversationId}`)
    await update(conversationTimeRef, {updated_at:serverTimestamp()})
    //cai lai cuoc tro truyen de khi tao moi tin nhan thi cuoc tro chuyen se update theo
    const userConversationRef = ref(db, `users/${userIdsend}/conversations`)
    await update(userConversationRef, {[conversationId]:serverTimestamp()})
    await update(userConversationRef, {[conversationId]:serverTimestamp()})

}
const createPostMessage = async (conversationId, userIdsend,userIdRecive, postId,typePost) => {

    const messageRef = push(ref(db, `messages/${conversationId}`))
    const messageId = messageRef.key
    const message = {
        "text": "Chia sẻ bài viết",
        "post_id":postId,
        "sender_id": userIdsend,
        "created_at": serverTimestamp(),
        "type": "post",
        "type_post":typePost
        
    }

    //tao message moi
    await set(messageRef, message)

    //update lai last message
    const conversationLastMessRef = ref(db, `conversations/${conversationId}/last_message`)
    await update(conversationLastMessRef, message)

    const conversationTimeRef = ref(db, `conversations/${conversationId}`)
    await update(conversationTimeRef, {updated_at:serverTimestamp()})
    //cai lai cuoc tro truyen de khi tao moi tin nhan thi cuoc tro chuyen se update theo

    const userConversationRef = ref(db, `users/${userIdsend}/conversations`)
    await update(userConversationRef, {[conversationId]:serverTimestamp()})

    const user2ConversationRef = ref(db, `users/${userIdRecive}/conversations`)
    await update(user2ConversationRef, {[conversationId]:serverTimestamp()})


}
const getMessages=(conversationId,callback)=>{
    const messagesRef = ref(db, `messages/${conversationId}`)
    //lay 50 tin nhan gan nhat
    const messageQuery= query(messagesRef,orderByChild('created_at'),limitToLast(50))
    
    const unsubscribe =onValue(messageQuery, (snapshot) => {
        const messages=[]
        snapshot.forEach((child)=>{
            messages.push({
                id:child.key,
                ...child.val()
            })
        })
        callback(messages)
    })
    return ()=>{
        unsubscribe()
    }
}
const getUserConversations= (userId,callback)=>{
    const userConversationRef=ref(db,`users/${userId}/conversations`)

    
    const unsubscribe=onValue(userConversationRef,async(snapshot)=>{
        const conversations=( snapshot.val()||{})
        //chuyen doi sang mang va sap xep tu moi nhat den cu
        const conversationArray = Object.entries(conversations);
        conversationArray.sort((a, b) => b[1] - a[1]);
        const sortedConversationIds = conversationArray.map(item => item[0]);
        const arrayConversations=[]
        for(const conversationId of sortedConversationIds){
            const detailConversationRef=ref(db,`conversations/${conversationId}`)
            const detailConversation=await get((detailConversationRef))
            if(detailConversation.exists()){
                arrayConversations.push({
                    id:conversationId,
                    ...detailConversation.val()
                })
    
            }
          
        }
        callback(arrayConversations)
    })
    return ()=>{
        unsubscribe()
    }

}
const checkExistConversation=async (userId1,userId2)=>{

    const idKey = [userId1, userId2].sort().join("_")

    const conversationRef = ref(db, "conversations/" + idKey)
    const conversation = await get(conversationRef)

    if(conversation.exists()){
        let conversationId = conversation.key
        return ({
            id:conversationId,
            ...conversation.val()
        })
    }else{
        return null
    }
}
export { createConversation, createTextMessage, createUser,getMessages,getUserConversations ,checkExistConversation,createPostMessage,createConversationId}
// const changes = {
//     [`conversations/${idKey}`]: {
//         "participants": {
//             "user_1": userId1,
//             "user_2": userId2,
//         },
//         "created_at": serverTimestamp(),
//         "updated_at": serverTimestamp(),
//         "active": true
//     },
//     [`users/${userId1}/conversations/${idKey}`]: true,
//     [`users/${userId2}/conversations/${idKey}`]: true
// };
// await update(ref(db, changes))


// const changes = {}

// changes[`messages/${conversationId}/${messageId}`] = message
// changes[`conversations/${conversationId}/last_message`] = message
// changes[`conversations/${conversationId}/updated_at`] = serverTimestamp()

// await update(ref(db), changes)