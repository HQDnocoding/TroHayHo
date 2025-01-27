

export const sampleAvatar = "https://drive.usercontent.google.com/download?id=1fPVkJqspSh0IQsQ_8teVapd5qf_q1ppV&authuser=0"
export const sampleImage = "https://res.cloudinary.com/df5wj9kts/image/upload/v1732878598/cld-sample-4.jpg"
export const sampleImage2 = "https://res.cloudinary.com/df5wj9kts/image/upload/v1732878597/samples/coffee.jpg"
export const NGUOI_THUE_TRO = 'nguoi_thue_tro'
export const CHU_TRO = 'chu_tro'
export const role_id_chu_tro = 2
export const role_id_nguoi_thue = 3
export const data_post_followed=(followedId)=>{
    return({
        "followed":followedId
    })
}
export const data_patch_active=(active)=>{
    return({
        "active":active
    })
}
export const data_patch_is_read=(isRead)=>{
    return({
        "is_read":isRead
    })
}
export const myYellow="#FFBA00"
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
