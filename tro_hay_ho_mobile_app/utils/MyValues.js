export const sampleAvatar = "https://drive.usercontent.google.com/download?id=1fPVkJqspSh0IQsQ_8teVapd5qf_q1ppV&authuser=0"
export const sampleImage = "https://res.cloudinary.com/df5wj9kts/image/upload/v1732878598/cld-sample-4.jpg"
export const NGUOI_THUE_TRO = 'nguoi_thue_tro'
export const CHU_TRO = 'chu_tro'
export const tempUser = {
    "id": 2,
    "username": "duc",
    "first_name": "Trần",
    "last_name": "Đức",
    "avatar": "https://res.cloudinary.com/dmbvjjg5a/image/upload/v1736745447/aerawblwrbfifhu68zm7.jpg",
    "role": {
        "id": 2,
        "created_date": "2025-01-13T10:40:45.350849+07:00",
        "updated_date": "2025-01-13T10:40:45.350849+07:00",
        "active": true,
        "role_name": "chu_tro"
    },
    "phone": null,
    "date_joined": "2025-01-13T12:17:23.254441+07:00"
}
export const tempUser2 = {
    "id": 3,
    "username": "thue",
    "first_name": "THi",
    "last_name": "hoa",
    "avatar": "https://res.cloudinary.com/dmbvjjg5a/image/upload/v1736745519/mbupmp9odn6zkxl4pbbm.png",
    "role": {
        "id": 3,
        "created_date": "2025-01-13T10:40:45.353855+07:00",
        "updated_date": "2025-01-13T10:40:45.353855+07:00",
        "active": true,
        "role_name": "nguoi_thue_tro"
    },
    "phone": null,
    "date_joined": "2025-01-13T12:18:35.199732+07:00"
}
//edit structure data in firebase
const user = () => {
    return (
        {
            "users": {
                "user_2": {
                    "id": 2,
                    "username": "duc",
                    "first_name": "",
                    "last_name": "",
                    "avatar": "https://example.com/avatar.jpg",
                    "conversations": {
                        "conversation_id_1": true,
                        "conversation_id_2": true
                    }
                },
                "user_3": {
                    "id": 3,
                    "username": "thue",
                    "first_name": "",
                    "last_name": "",
                    "avatar": "https://example.com/avatar2.jpg",
                    "conversations": {
                        "conversation_id_1": true
                    }
                }
            }




        }
    )
}
const conversation = () => {
    return ({
        "conversations": {
            "conversation_id_1": {
                "participants": {
                    "user_1": "",
                    "user_2": ""
                },
                "created_at": 1705305594198,
                "updated_at": 1705305594198,
                "last_message": {
                    "text": "Hello there!",
                    "sender_id": "user_2",
                    "timestamp": 1705305594198
                },

                "active": true

            }
        }
    })
}
const message = () => {
    return {
        "messages": {
            "conversation_id_1": {
                "message_1": {
                    "text": "Hello there!",
                    "sender_id": "user_2",
                    "timestamp": 1705305594198,
                    "type": "text"
                },
                "message_2": {
                    "text": "Hi, how are you?",
                    "sender_id": "user_3",
                    "timestamp": 1705305594200,
                    "type": "text"
                }
            }
        }
    }
}